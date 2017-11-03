Feature: Students
  In order to manage students
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

  @javascript
  Scenario: Create a new student
    Given I am on "/students/new"
    When I fill in "student_form_name" with "Mario"
    And I fill in "student_form_surname" with "Rossi"
    And I fill in "student_form_email" with "mario.rossi@gmail.com"
    And I press "student_form_submit"
    Then I should see "creato"

  Scenario: Create a new student error
    Given I am on "/students/new"
    When I fill in "student_form_name" with "Ma"
    And I fill in "student_form_surname" with "Rossi"
    And I fill in "student_form_email" with "mario.rossigmail.com"
    And I press "student_form_submit"
    Then I should see "Questo valore è troppo corto"
