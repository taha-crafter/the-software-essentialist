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