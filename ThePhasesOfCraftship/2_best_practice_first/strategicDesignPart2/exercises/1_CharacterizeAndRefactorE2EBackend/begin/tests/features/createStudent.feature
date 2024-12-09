Feature: Create Student

	As an administrator
	I want to create a student
	So that I can add them to a classroom

  Scenario: Successfully create a student
    Given I want to create a student named "John Doe" with email "john.doe@example.com"
    When I request to create a student
    Then the student should be successfully created

  Scenario: Fail to create a student with missing email
    Given I want to create a student named "Jane Doe" with no email
    When I request to create a student
    Then the student should not be created
    And I should receive a validation error