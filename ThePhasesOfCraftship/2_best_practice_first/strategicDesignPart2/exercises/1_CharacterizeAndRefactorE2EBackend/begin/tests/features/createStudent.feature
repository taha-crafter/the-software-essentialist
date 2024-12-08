Feature: Create Student

	As an administrator
	I want to create a student
	So that I can add them to a classroom

  Scenario: Successfully create a student
    Given I want to create a student named "John Doe" with email "john.doe@example.com"
    When I request to create a student
    Then the student should be successfully created