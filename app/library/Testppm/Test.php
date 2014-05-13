<?php

/**
 * Concrete class for generating debug dumps related to the output source.
 */
class Test extends Phalcon\Mvc\User\Component
{
    public function test($test=null){
        return $test.'_Mod';
    }
    
}
