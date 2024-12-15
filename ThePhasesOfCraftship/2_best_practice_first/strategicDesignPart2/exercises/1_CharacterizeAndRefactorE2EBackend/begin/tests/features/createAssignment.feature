Feature: Create Assignment

  As a teacher
  I want to create assignments for my class
  So that students can have structured tasks to achieve learning objectives

  Scenario: Successfully create an assignment
    Given a class exists
    When I create an assignment
    Then the assignment is created