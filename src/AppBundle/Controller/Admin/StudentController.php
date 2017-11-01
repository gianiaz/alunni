<?php
// 30/10/17, 23.45
// @author : Giovanni Battista Lenoci <gianiaz@gmail.com>

namespace AppBundle\Controller\Admin;


use AppBundle\Entity\Student;
use AppBundle\Form\StudentForm;
use AppBundle\Service\StudentService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormConfigInterface;
use Symfony\Component\Form\FormError;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Translation\TranslatorInterface;

class StudentController extends Controller
{
    /**
     * @var StudentService
     */
    private $studentService;
    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * StudentController constructor.
     */
    public function __construct(StudentService $studentService, TranslatorInterface $translator)
    {
        $this->studentService = $studentService;
        $this->translator = $translator;
    }


    /**
     * @Route("/studends", name="students")
     */
    public function listAction()
    {

        return $this->render(':admin/students:list.html.twig');

    }

    /**
     * @Route("/students/json", name="students_list_json")
     */
    public function listJson(Request $request)
    {

        $em = $this->getDoctrine()->getManager();

        $return = [];
        $return['result'] = true;
        $return['data'] = $this->studentService->getList();

        return new JsonResponse($return);

    }

    /**
     * @Route("/students/new", name="students_new")
     * @Route("/students/edit/{id}",  name="students_edit", requirements={"id": "\d+"})
     */
    public function newEditAction(Request $request)
    {

        $em = $this->getDoctrine()->getManager();

        $Student = new Student();

        $id = null;
        $errors = false;

        if ($request->get('id')) {

            $id = $request->get('id');

            $Student = $em->getRepository('AppBundle:Student')->findOneBy(['id' => $id]);

            if (!$Student) {
                return $this->redirectToRoute('students_new');
            }

        }


        $form = $this->createForm(
            StudentForm::class,
            $Student
        );

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            /**
             * @var $Student Student
             */

            $Student = $form->getData();

            $new = false;

            if (!$Student->getId()) {
                $new = true;
            }

            $em->persist($Student);
            $em->flush();

            $nextAction = $form->get('submitmail')->isClicked()
                ? 'sendmail'
                : 'success';

            $elemento = $Student->getName();

            if ($nextAction == 'sendmail') {
                $this->studentService->sendMail($Student);
            }

            if (!$new) {
                $this->addFlash(
                    'success',
                    'Studente "'.$elemento.'" '.$this->translator->trans('default.labels.modificato')
                );
            } else {
                $this->addFlash(
                    'success',
                    'Studente "'.$elemento.'" '.$this->translator->trans('default.labels.creato')
                );
            }


            return $this->redirectToRoute('students');

        } else {
            $errors = [];
            foreach ($form->getErrors(true) as $error) {
                /**
                 * @var $error FormError
                 */

                /**
                 * @var $Config FormConfigInterface
                 */
                $Config = $error->getOrigin()->getConfig();

                $lbl = $Config->getOptions()['label'];
                if ($lbl) {
                    $lbl = $this->translator->trans($lbl);
                } else {
                    $lbl = ucfirst($Config->getName());
                }
                $errors[] = $lbl.': '.$error->getMessage();
            }

            $errors = array_unique($errors);
            $errors = implode('<br />', $errors);

        }

        $view = ':admin/students:new.html.twig';

        if ($Student->getId()) {
            $view = ':admin/students:edit.html.twig';
        }

        $formView = $form->createView();

        return $this->render(
            $view,
            ['form' => $formView, 'errors' => $errors]
        );


    }

    /**
     * @Route("/students/delete/{id}", name="students_delete",  requirements={"id" = "\d+"})
     */
    public function deleteAction(Request $request, Student $Student)
    {

        if ($Student) {

            $elemento = $Student->getName().' '.$Student->getSurname().' ('.$Student->getId().')';

            $em = $this->getDoctrine()->getManager();

            $em->remove($Student);
            $em->flush();

            $this->addFlash(
                'success',
                'Studente "'.$elemento.'" '.$this->translator->trans('default.labels.eliminato')
            );


        }


        return $this->redirectToRoute('students');

    }

}