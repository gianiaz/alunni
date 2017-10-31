<?php
// 31/10/17, 0.00
// @author : Giovanni Battista Lenoci <gianiaz@gmail.com>

namespace AppBundle\Service;


use AppBundle\Entity\Student;
use Doctrine\ORM\EntityManager;

class StudentService
{
    /**
     * @var EntityManager
     */
    private $entityManager;


    /**
     * StudentService constructor.
     */
    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
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
            $record['createdAt'] = $Student->getCreatedAt()->format('d/m/Y H:i:s');
            $record['updatedAt'] = $Student->getUpdatedAt()->format('d/m/Y H:i:s');

            $records[] = $record;
        }

        return $records;

    }


}