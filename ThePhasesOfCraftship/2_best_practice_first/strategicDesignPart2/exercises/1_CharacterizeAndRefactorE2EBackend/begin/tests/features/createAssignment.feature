Feature: Create Assignment

  As a teacher
  I want to create assignments for my class
  So that students can have structured tasks to achieve learning objectives

  Scenario: Successfully create an assignment
    Given a class exists
    When I create an assignment
    Then the assignment is created

  Scenario: Fail to create an assignment with a missing class
    Given a class does not exist
    When I create an assignment
    Then the assignment is not created

  Scenario: Fail to create the same assignment twice
    Given a class exists
    And an assignment exists for the class
    When I create an assignment with the same title
    Then the assignment should not be created