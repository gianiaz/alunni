<?php
// 31/10/17, 0.27
// @author : Giovanni Battista Lenoci <gianiaz@gmail.com>

namespace AppBundle\Form;


use AppBundle\Entity\Student;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\SubmitButton;
use Symfony\Component\OptionsResolver\OptionsResolver;

class StudentForm extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {

        $builder->add('name', TextType::class, ['label' => 'students.labels.name']);
        $builder->add('surname', TextType::class, ['label' => 'students.labels.surname']);
        $builder->add('email', EmailType::class, ['label' => 'students.labels.email']);
        $builder->add(
            'votes',
            CollectionType::class,
            ['entry_type' => VoteForm::class, 'allow_add' => true, 'label' => false, 'by_reference' => false]
        );
        $builder->add(
            'submit',
            SubmitType::class,
            [
                'attr' => ['class' => 'btn btn-success btn-submit-mail'],
                'label' => 'default.labels.salva',
            ]
        );
        $builder->add(
            'submitmail',
            SubmitType::class,
            [
                'attr' => ['class' => 'btn btn-success btn-submit-mail disabled'],
                'label' => 'default.labels.salva_e_invia',
            ]
        );

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => Student::class,
            ]
        );
    }

}