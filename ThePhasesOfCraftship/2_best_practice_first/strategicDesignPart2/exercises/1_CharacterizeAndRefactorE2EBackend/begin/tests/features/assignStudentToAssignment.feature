Feature: Assign Student to Assignment

  As a teacher
  I want to assign assignments to students
  So that students can have specific tasks to complete for their learning

  Scenario: Successfully assign student to assignment
    Given a student named "John Doe" exists and enrolled in a class
    And an assignment named "Math Homework" exists for the class
    When I assign "John Doe" to "Math Homework"
    Then "John Doe" should be assigned to "Math Homework" successfully