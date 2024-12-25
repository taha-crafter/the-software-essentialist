import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { CreateUserParams } from "../../../shared/src/api/users";
import { CreateUserBuilder } from "../../../shared/tests/support/builders/createUserBuilder";
import request from "supertest";
import { app, server } from "../../src/index";

beforeAll(async () => {});

afterAll(async () => {
  server.close();
});

const featurePath = path.resolve(
  __dirname,
  "../../../shared/tests/features/registration.feature",
);
const feature = loadFeature(featurePath);

defineFeature(feature, (test) => {
  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserParams: CreateUserParams;
    let createUserResponse: any = {};
    let addEmailToListResponse: any = {};

    given("I am a new user", () => {
      createUserParams = new CreateUserBuilder().withAllRandomDetails().build();
    });

    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        createUserResponse = await request(app)
          .post("/users/new")
          .send(createUserParams);

        addEmailToListResponse = await request(app)
          .post("/marketing/new")
          .send({
            email: createUserParams.email,
          });
      },
    );

    then("I should be granted access to my account", () => {
      const { data, success, error } = createUserResponse.body;
      expect(createUserResponse.status).toBe(201);
      expect(data!.id).toBeDefined();
      expect(data!.email).toEqual(createUserParams.email);
      expect(data!.firstName).toEqual(createUserParams.firstName);
      expect(data!.lastName).toEqual(createUserParams.lastName);
      expect(data!.username).toEqual(createUserParams.username);
    });

    and("I should expect to receive marketing emails", () => {
      const { success } = addEmailToListResponse.body;
      expect(addEmailToListResponse.status).toBe(201);
      expect(success).toBeTruthy();
      expect(addEmailToListResponse.body.error).toBeUndefined();
      expect(addEmailToListResponse.body.data.email).toBe(
        createUserParams.email,
      );
    });
  });

  test("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});

    when(
      "I register with valid account details declining marketing emails",
      () => {},
    );

    then("I should be granted access to my account", () => {});

    and("I should not expect to receive marketing emails", () => {});
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});

    when("I register with invalid account details", () => {});

    then(
      "I should see an error notifying me that my input is invalid",
      () => {},
    );

    and("I should not have been sent access to account details", () => {});
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    given("a set of users already created accounts", (table) => {});

    when("new users attempt to register with those emails", () => {});

    then(
      "they should see an error notifying them that the account already exists",
      () => {},
    );

    and("they should not have been sent access to account details", () => {});
  });

  test("Username already taken", ({ given, when, then, and }) => {
    given(
      "a set of users have already created their accounts with valid details",
      (table) => {},
    );

    when(
      "new users attempt to register with already taken usernames",
      (table) => {},
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {},
    );

    and("they should not have been sent access to account details", () => {});
  });
});
