Feature: Students
  In order to access students list
  As a web user
  I need to access to the students page

  Scenario: Looking for students menu
    Given I am on "/"
    And I follow "studentsMenu"
    Then I should see "Alunni: Elenco elementi"

  Scenario: Access to create form
    Given I am on "/"
    And I follow "studentsMenu"
    And I follow "Nuovo"
    Then I should see "Alunni: Nuovo"