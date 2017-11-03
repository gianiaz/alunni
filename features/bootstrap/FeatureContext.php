<?php

use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Behat\MinkExtension\Context\MinkContext;

/**
 * Defines application features from the specific context.
 */
class FeatureContext extends MinkContext implements Context
{

    private $webDriver;
    protected $session;
    protected $page;

    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct()
    {
        $this->webDriver = new \Behat\Mink\Driver\Selenium2Driver();
        $this->session = new \Behat\Mink\Session($this->webDriver);

    }

    /**
     * @When I click :id
     */
    public function iClick($id)
    {

        $this->page = $this->session->getPage();

        $nodeElement = $this->page->find('css', '#'.$id);

        if ($nodeElement === null) {
            throw new Exception($id." could not be found");
        } else {
            $nodeElement->click();
        }

    }
}
