<?php

	header("Content-type: application/javascript");

	//ini_set("display_errors", 1);
	//error_reporting(E_ALL);
	require_once('wrapper.php');
 
	/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
	$settings = array(
	    'oauth_access_token' => "2689619802-SFY1XI2gPlyPSiXBxJTvaNyVX2zyljAW3xIUDWf",
	    'oauth_access_token_secret' => "HQl82hiqNfivzNa1f2QrCZ44KAIrJN9t2EJbabmL9g2Cz",
	    'consumer_key' => "C8K9JMz71OfBqHtqd5uxtwwhz",
	    'consumer_secret' => "ZHUFL2jdxpK6fxCd3tlE0f0MJ9MbeeZVRRGjAWhedzdpoUkMPK"
	);

	$url = "https://api.twitter.com/1.1/statuses/user_timeline.json";
	$requestMethod = "GET";
	$getfield = "?count=500&include_rts=0&screen_name=".$_GET['name'];

	$twitter = new TwitterAPIExchange($settings);
	$result =  ($twitter->setGetfield($getfield)
	             ->buildOauth($url, $requestMethod)
	             ->performRequest());

	$return = $_GET["callback"] . "(" . $result . ");";
	echo $return;