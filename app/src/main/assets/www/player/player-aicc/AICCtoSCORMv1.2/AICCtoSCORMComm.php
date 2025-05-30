<?php
//error_reporting(E_ALL);
ob_start();
print "<html><body><h1><strong>DO NOT CLOSE THIS WINDOW. <br> It will close on it's own.</strong></h1></body></html>";

$rawPost = file_get_contents("php://input");

$commandType;
$dataModelElementsString;
$dataModelElements = array();
$model = array();
$data = array();
$contentLocation;
$sid;
$dataFile;
$contentData;

$jsHeading = "\t // handling each AICC data model and preforming the SCORM calls \n"
			."\t var res = \"\" \n \t if(debugging) document.write(\"** Data Model Elements being converted from AICC to SCORM 1.2 ** </br>\" \n" 
			. "\t\t\t\t\t\t\t\t + \"** doLMSSetValue() ** called on the following Data Model Elements: </br>\"); \n\n alert('Reading js data Now!!'); \n\n";
			
if(sizeof($_GET) != 0)
{
	start($_GET);
}

if(sizeof($_POST) != 0)
{
	start($_POST);
}

function start($Param)
{
	global $commandType, $dataModelElementsString, $dataModelElements, $contentLocation, $contentData, $dataFile, $sid, $_SERVER;
	
	
	foreach($Param as $name => $value) 
	{
		if($name == "command")
		{
			/*
			 * Get the command type paramenter
			 */
			$commandType = $value;
		}
		
		if($name == "aicc_data")
		{
			$aicc_data = explode(";", $value);
			
			$dataModelElementsString = $aicc_data[3];
			
			$dataModelElements = explode("\n", $dataModelElementsString);
		}
		
		// used when first launch to get the content location
		if($name == "content_loc")
		{
			$contentLocation = $value;
		}
		
		if($name == "session_id")
		{
			$sid = $value;
		}
		
		if($name == "terminate")
		{
			unlink("js/".$value."_contentData.js");
			unlink("data/".$value."_data.txt");
		}
	}
	
	// start AICC to SCOR conversions
	AICCtoSCORM();
}

function AICCtoSCORM()
{
	global $commandType, $dataModelElementsString, $dataModelElements, $contentLocation, $dataFile, $model, $data, $idFile, $contentData, $jsHeading, $sid;
	
	$debug = true;
	$debugFilePtr;
	$GetParamDebugFile = "debug/GetParamLog.txt";
	$PutParamDebugFile = "debug/PutParamLog.txt";
	$InitDebugFile = "debug/InitLog.txt";
	$ExitAUDebugFile = "debug/ExitAULog.txt";
	$dataFile = "data/".$sid."_data.txt";
	$contentData = "js/".$sid."_contentData.js";
	
	switch($commandType)
	{
		// Gets initial data from LMS to send to the content
		case "init":
			
			InitializeJsFile();
			
			ParseQueryString();
			
			// data recieved from LMS at launch time to pass over to the content
			//stroed in a text file untill GetParam is called
			$dataText = "$contentLocation:|:";
			for($k = 0; $k < sizeof($model); $k++)
			{
				$dataText .= $model[$k] . "=" . $data[$k] . ":|:"; 
			}
			
			// write data to file to read later in GetParam Command
			$fp = fopen($dataFile, "w") or die("Couldn't open $dataFile for writing!");
			$retVal = fwrite($fp, $dataText) or die("Couldn't write values to file!"); 
			
			fclose($fp);
			
			
			// for debug purposes writes data to a log file
			if ($debug)
			{
				$debugFilePtr = fopen($InitDebugFile, "a") or die("Couldn't open $InitDebugFile for writing!");
				
				$debugText = "In Init case following data was written to ". $dataFile ." file:\n";
				$debugText .= $dataText . "\n\n";
				$debugText .= "The javascript data file was initialized with the following heading: \n";
				$debugText .= $jsHeading . "\n\n";
				$debugText .= "End of Init Log for " . date('l jS \of F Y h:i:s A') . "\n\n";
				
				$r = fwrite($debugFilePtr, $debugText) or die("Couldn't write values to file!");
				
				fclose($debugFilePtr);
			}
			
			break;
		
		// Sends the data to the content
		case "GetParam":
			
			$fp = fopen($dataFile, "r") or die("Couldn't open $dataFile for reading!");
			$contents = fread($fp, filesize($dataFile)) or die("Couldn't read values to file!"); 

			fclose($fp);
			
			$readData = explode(":|:", $contents);
			$temp = $readData[0];
			$temp2 = explode("?", $temp);
			$contentLocation = $temp2[0];
			$accCode = $temp2[1];
			
			$query  = GenerateReturnQueryString($readData);
			$fullQuery = $query;
			
			ob_end_clean();
			
			$DatModels = explode("&", $query);
			
			// echo back a response to AlertDriving Content
			for($j=0; $j<sizeof($DatModels); $j++)
			{
				echo $DatModels[$j];
			}
			
			// for debug purposes writes data to a log file
			if ($debug)
			{
				$debugFilePtr = fopen($GetParamDebugFile, "a") or die("Couldn't open $GetParamDebugFile for writing!");
				
				$debugText = "In GetParam case following data was read from " . $dataFile . " file:\n";
				$debugText .= $contents . "\n\n";
				$debugText .= "The content is located at: \n";
				$debugText .= $contentLocation ."\n\n";
				$debugText .= "The following response string was generated from the" . $dataFile . ":\n";
				
				for($j=0; $j<sizeof($DatModels); $j++)
				{
					$debugText .= $DatModels[$j];
				}
				
				$debugText .= "End of GetParam Log for " . date('l jS \of F Y h:i:s A') . "\n\n";
				
				$r = fwrite($debugFilePtr, $debugText) or die("Couldn't write values to file!");
				
				fclose($debugFilePtr);
			}
			
			break;
		
		// stores the data being sent from the content to store in LMS
		case "PutParam":
			
			ParseQueryString();
						
			for($k = 0; $k < sizeof($model); $k++)
			{
				if (strpos($model[$k], "lesson_location") !== false)
				{ 		
					$jsText .=	"\t // perform the equivalent SCORM 1.2 call and set that value in the LMS \n"
								. "\t res = doLMSSetValue(\"cmi.core.lesson_location\",\"". trim($data[$k]) ."\"); \n"
						
								. "\t if(debugging) document.write(\"AICC: lesson_location </br> SCORM 1.2: cmi.core.lesson_location = ". trim($data[$k]) ."</br>\" \n"
														 . "\t\t\t\t\t\t\t\t + \" LMS returns: \" + res + \"</br>\"); \n\n";

				}
				else if (strpos($model[$k], "lesson_status") !== false)
				{
					$jsText .= 	"\t // perform the equivalent SCORM 1.2 call and set that value in the LMS \n"
								. "\t res = doLMSSetValue(\"cmi.core.lesson_status\", \"". trim($data[$k]) ."\"); \n"
									
								."\t if(debugging) document.write(\"AICC: lesson_status </br> SCORM 1.2: cmi.core.lesson_status = ". trim($data[$k]) ."</br>\" \n"
																. "\t\t\t\t\t\t\t\t + \"LMS returns: \" + res + \"</br>\"); \n\n";
				}
				else if (strpos($model[$k], "score") !== false)
				{
					$temp = explode("%", $data[$k]);
					$mystr = $temp[0];
					
					if(ord($mystr{1}) == 0)
					{
						$mystr = "";
					}
					else 
					{
						if(substr($data[$k], 0, 3) == "100")
						{
							$mystr = "100";
						}
						else
						{
							$mystr = substr($data[$k], 0, strlen($mystr)-1);
						}
					}
					
					//dont send a score if the score is ""
					if($mystr != "")
					{
						//print "temp of 0 = \"$mystr\"<br>";
						$jsText .=	"\t // perform the equivalent SCORM 1.2 call and set that value in the LMS \n"
								. "\t res = doLMSSetValue(\"cmi.core.score.raw\", \"$mystr\"); \n"
									
								. "\t if(debugging) document.write(\"AICC: score </br> SCORM 1.2: cmi.core.score.raw = ". $mystr ."</br>\" \n"
															. "\t\t\t\t\t\t\t\t + \"LMS returns: \" + res + \"</br>\"); \n\n";
					}
				}
				else if (strpos($model[$k], "time") !== false)
				{
					$jsText .= "\t // perform the equivalent SCORM 1.2 call and set that value in the LMS \n"
								. "\t res = doLMSSetValue(\"cmi.core.session_time\", \"". trim($data[$k]) ."\"); \n"
									
								. "\t if(debugging) document.write(\"AICC: time </br> SCORM 1.2: cmi.core.session_time = ". trim($data[$k]) ."</br>\" \n"
															 . "\t\t\t\t\t\t\t\t + \"LMS returns: \" + res + \"</br>\"); \n\n";		
				} 
			}
			
			// write data to file to read later By the LMS
			$fp = fopen($contentData, "a") or die("Couldn't open $contentData for writing!");
			$retVal = fwrite($fp, $jsText) or die("Couldn't write values to file!"); 
			
			fclose($fp);
			
			ob_end_clean();
			
			echo "Error=0\nerror_text=Successful\nversion=1.2\naicc_data=";
			
			// for debug purposes writes data to a log file
			if ($debug)
			{
				$debugFilePtr = fopen($PutParamDebugFile, "a") or die("Couldn't open $PutParamDebugFile for writing!");
				
				$debugText = "In PutParam case following javascript was written to ". $contentData ." file:\n";
				$debugText .= $jsText . "\n\n";
				$debugText .= "The following response was echoed back: \n";
				$debugText .= "Error=0\nerror_text=Successful\nversion=1.2\naicc_data=\n\n";
				$debugText .= "The return value from fwrite(): \n";
				$debugText .= $retVal . "\n\n";
				$debugText .= "End of PutParam Log for " . date('l jS \of F Y h:i:s A') . "\n\n";
				
				$r = fwrite($debugFilePtr, $debugText) or die("Couldn't write values to file!");
				
				fclose($debugFilePtr);
			}
			
			break;
		
		// terminates connection with content
		case "ExitAU":
			
			ob_end_clean();
			
			echo "Error=0\nerror_text=Successful\nversion=1.2\naicc_data=";
			
			// for debug purposes writes data to a log file
			if ($debug)
			{
				$debugFilePtr = fopen($ExitAUDebugFile, "a") or die("Couldn't open $ExitAUDebugFile for writing!");
				
				$debugText = "In ExitAU case \n\n";
				$debugText .= "The following response was echoed back: \n";
				$debugText .= "Error=0\nerror_text=Successful\nversion=1.2\naicc_data=\n\n";
				$debugText .= "End of PutParam Log for " . date('l jS \of F Y h:i:s A') . "\n\n";
				
				$r = fwrite($debugFilePtr, $debugText) or die("Couldn't write values to file!");
				
				fclose($debugFilePtr);
			}
			
			break;
	}
}

function GenerateReturnQueryString($conData)
{
	$queryString = "Error=0\n&error_text=Successful\n&version=1.2\n&aicc_data=\n[CORE] \n";
	$temp;
	for($i=1; $i<sizeof($conData) - 1 ; $i++)
	{
		$temp = explode("=", $conData[$i]);
		$queryString .= $temp[0] . "=" .$temp[1] . "\n";
	}
	
	return $queryString;
}

function PerformPost($contentLoc, $query)
{
	$ch = curl_init();    
	curl_setopt($ch, CURLOPT_URL, $contentLoc);  
	curl_setopt($ch, CURLOPT_POST, 1); 
	curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
	$returnVal = curl_exec ($ch);     
	curl_close ($ch); 
	
	return $returnVal;
}


function ParseQueryString()
{
	global $model, $data, $dataModelElements;
	
	$i = 0;
	$modelanddata = array();
	
	foreach($dataModelElements as $modelData)
	{
		$modelanddata = explode(" = ", $modelData);
		$model[$i] = $modelanddata[0];
		$data[$i] = $modelanddata[1];
		$i++;
	}
	// get rid of unecessary data
	for($j = 0; $j < 2; $j++)
	{
		$notNeeded = array_shift($model);
		$notNeeded = array_shift($data);
	}
}


function InitializeJsFile()
{
	global $jsHeading, $contentData;
			
	// write data to file to read later in GetParam Command
	$fp = fopen($contentData, "w") or die("Couldn't open $contentData for writing!");
	$retVal = fwrite($fp, $jsHeading) or die("Couldn't write values to file!"); 
	
	fclose($fp);
}
?>