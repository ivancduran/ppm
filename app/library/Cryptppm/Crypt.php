<?php

class Crypt extends Phalcon\Mvc\User\Component
{

	// SECRET KEY HERE
	private $SecretKey = '3dccd3e529a4103efe7547b069a1466b';
	private $iv;

    function __construct()
    {
    	$size = mcrypt_get_iv_size(MCRYPT_CAST_256, MCRYPT_MODE_CFB);
    	$this->iv = mcrypt_create_iv($size, MCRYPT_DEV_RANDOM);
    }

	public function encode($value=null)
	{
	   if(!$value) return false;

	   $crypttext = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $this->SecretKey, $value, MCRYPT_MODE_ECB, $this->iv);
	   return trim(base64_encode($crypttext));
	}
 
	public function decode($value=null)
	{
	   if(!$value) return false;

	   $crypttext = base64_decode($value);
	   $decrypttext = mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $this->SecretKey, $crypttext, MCRYPT_MODE_ECB, $this->iv);
	   return trim($decrypttext);
	}

}