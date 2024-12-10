Feature: Create Classroom

	As an administrator
	I want to create a classroom
	So that I can add students to it

  Scenario: Successfully create a classroom
    Given I want to create a classroom named "Math 101"
    When I request to create a classroom
    Then the classroom should be successfully created

  Scenario: Fail to create a classroom without a name
    Given I want to create a classroom without a name
    When I request to create a classroom
    Then the classroom creation should fail with a validation error
