Feature: Enroll Student in a classroom

	As an administrator
	I want to enroll a student in a classroom
	So that they can attend the class

	Scenario: Successfully enroll a student in a classroom
		Given there is a class and a student
		When I enroll the student to the class
		Then the student should be enrolled to the class successfully
	
	Scenario: Fail to enroll a student in a non-existent classroom
		Given there is a student and a class that doesn't exist
		When I try to enroll the student to the class
		Then the enrollment should fail

	Scenario: Fail to enroll a student twice
		Given there is a student enrolled in a class
		When I try to enroll the student again
		Then the enrollment should fail