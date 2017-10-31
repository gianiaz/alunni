<?php
// 30/10/17, 23.19
// @author : Giovanni Battista Lenoci <gianiaz@gmail.com>

namespace AppBundle\Controller\Admin;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DashBoardController extends Controller
{

    /**
     * @Route("/", name="dashboard")
     */
    public function indexAction()
    {

        $em = $this->getDoctrine()->getManager();

        return $this->render('admin/dashboard/dashboard.html.twig', []);

    }

}
