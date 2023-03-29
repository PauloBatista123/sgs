<?php

namespace Novosga\Model;

/**
 * Slide de atendimento.
 *
 * @Entity
 * @Table(name="slides")
 */
class Slide extends SequencialModel
{
    /**
     * @Column(type="string", name="caminho", length=255, nullable=false, unique=false)
     */
    protected $caminho;

    /**
     * @OneToOne(targetEntity="Unidade", fetch="EAGER")
     * @JoinColumn(name="unidade_id", referencedColumnName="id", nullable=false)
     */
    protected $unidade;

    public function __construct()
    {
    }

    public function setCaminho($caminho)
    {
        $this->caminho = $caminho;
    }

    public function getCaminho()
    {
        return $this->caminho;
    }

    public function setUnidade(Unidade $unidade)
    {
        $this->unidade = $unidade;
    }

    /**
     * @return Unidade
     */
    public function getUnidade()
    {
        return $this->unidade;
    }

    public function toString()
    {
        return $this->getCaminho();
    }

    public function jsonSerialize()
    {
        return array(
            'id' => $this->getId(),
            'caminho' => $this->getCaminho(),
            'unidade' => $this->getUnidade(),
        );
    }
}
