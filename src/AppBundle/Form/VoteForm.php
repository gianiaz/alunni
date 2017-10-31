<?php
// 31/10/17, 0.27
// @author : Giovanni Battista Lenoci <gianiaz@gmail.com>

namespace AppBundle\Form;


use AppBundle\Entity\Vote;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\RangeType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class VoteForm extends AbstractType
{

    public function buildForm(FormBuilderInterface $builder, array $options)
    {

        $builder->add(
            'vote',
            NumberType::class,
            ['label' => 'students.labels.vote', 'attr' => ['min' => 0, 'max' => 10, 'step' => 1]]
        );

    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(
            [
                'data_class' => Vote::class,
            ]
        );
    }

}