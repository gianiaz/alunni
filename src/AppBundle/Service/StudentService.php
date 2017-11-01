<?php
// 31/10/17, 0.00
// @author : Giovanni Battista Lenoci <gianiaz@gmail.com>

namespace AppBundle\Service;


use AppBundle\Entity\Student;
use AppBundle\Entity\Vote;
use Doctrine\ORM\EntityManager;
use Symfony\Bridge\Twig\TwigEngine;
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\HttpKernel\KernelInterface;
use Twig\Template;

class StudentService
{
    /**
     * @var EntityManager
     */
    private $entityManager;
    /**
     * @var TwigEngine
     */
    private $twigEngine;
    /**
     * @var Kernel
     */
    private $kernel;
    /**
     * @var \Swift_Mailer
     */
    private $swiftMailer;


    /**
     * StudentService constructor.
     */
    public function __construct(
        EntityManager $entityManager,
        TwigEngine $twigEngine,
        KernelInterface $kernel,
        \Swift_Mailer $swiftMailer
    ) {
        $this->entityManager = $entityManager;
        $this->twigEngine = $twigEngine;
        $this->kernel = $kernel;
        $this->swiftMailer = $swiftMailer;
    }

    public function getList()
    {

        $Students = $this->entityManager->getRepository(Student::class)->findAll();

        $records = [];

        foreach ($Students as $Student) {
            /**
             * @var $Student Student;
             */
            $record = [];
            $record['id'] = $Student->getId();
            $record['name'] = $Student->getName();
            $record['surname'] = $Student->getSurname();
            $record['email'] = $Student->getEmail();
            $record['avg'] = $this->getAverage($Student);
            $record['createdAt'] = $Student->getCreatedAt()->format('d/m/Y H:i:s');
            $record['updatedAt'] = $Student->getUpdatedAt()->format('d/m/Y H:i:s');

            $records[] = $record;
        }

        return $records;

    }

    public function getAverage(Student $student)
    {

        $votes = [];

        foreach ($student->getVotes()->getIterator() as $vote) {
            /**
             * @var $vote Vote
             */
            $votes [] = $vote->getVote();
        }

        if (!count($votes)) {
            return 'N.A.';
        }

        return round(array_sum($votes) / count($votes), 2);
    }

    public function sendMail(Student $student)
    {

        $subject = 'Variazione voti';
        $text = '';

        $message = \Swift_Message::newInstance()
            ->setSubject($subject)
            ->setSender('info@alunni.net', 'Giovanni Battista Lenoci')
            ->setTo($student->getEmail());

        $data = [
            'logo' => $message->embed(
                \Swift_Image::fromPath($this->kernel->getProjectDir().'/web/media/99gen_dots.jpg')
            ),
            'subject' => $subject,
            'name' => $student->getName(),
            'surname' => $student->getSurname(),
            'text' => $text,
        ];


        $html = $this->twigEngine->render(
            'email.html.twig',
            $data
        );

        $message->setBody($html, 'text/html');

        $this->swiftMailer->send($message);
    }


}