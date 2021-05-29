<!DOCTYPE html>
<html>
<head>
	<title>Jordan McClintock</title>
	<link rel="stylesheet" type="text/css" href="normalize.css">
	<link rel="stylesheet" type="text/css" href="style.css">
	<link href="https://fonts.googleapis.com/css?family=Droid+Serif|Roboto" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="icon/initials.ico"/>
</head>

<body>
	<div class="navigation">
		<ul class="container">
			<li><a href="projects.html" class="removeStyling">Projects</a></li>
			<li><a href="contact.html" class="removeStyling">Contact</a></li>
			<li><a href="https://www.jordanmcclintock.com" class="removeStyling">About</a></li>
    	</ul>
	</div>

    <div class="spacer"></div>

	<div class="panel">
	    <div class="main">
		    <div class="container">
			    <h1 style="text-align: center">Contact Me</h1>

                <div class="col">
                    <h3>Name:</h3>
                    <h3>Email Address:</h3>
                    <h3>Subject:</h3>
                    <h3>Message:</h3>
                </div>

                <div class="col">
                    <form method=POST onsubmit="return validateFields()">
                        <input type="text" name="name" id="name" />
			            <div class="clear"></div>
                        <input type="text" name="email" id="email" />
			            <div class="clear"></div>
                        <input type="text" name="subject" id="subject" />
			            <div class="clear"></div>
                        <textarea rows="6" cols="50" id="message" name="message"></textarea>
			            <div class="clear"></div>
                        <input type="submit" class="button" value="Submit" />
                        <input type="button" class="button" value="Cancel" />
                        <!--<input type="text" id="message" />-->
                    </form>

                    <script type="text/javascript">
                        function validateFields() {
                            var valid = true;

                            if (document.getElementById("name").value.trim() == "") {
                                document.getElementById("name").style.background = "rgba(255, 72, 65, 0.4)";
                                valid = false;
                            }
                            if (document.getElementById("email").value.trim() == "") {
                                document.getElementById("email").style.background = "rgba(255, 72, 65, 0.4)";
                                valid = false;
                            }
                            if (document.getElementById("subject").value.trim() == "") {
                                document.getElementById("subject").style.background = "rgba(255, 72, 65, 0.4)";
                                valid = false;
                            }    
                            if (document.getElementById("message").value.trim() == "") {
                                document.getElementById("message").style.background = "rgba(255, 72, 65, 0.4)";
                                valid = false;
                            }        

                            if (!valid) {
                                alert("Please enter all fields!");
                            }

                            return valid;
                        }
                    </script>

                    <?php
                        if (!empty($_POST['name']) && !empty($_POST['email']) && !empty($_POST['subject']) && !empty($_POST['message'])) 
                        {
                            $to = 'jordanwmcclintock@gmail.com';
                            $subject = $_POST['subject'];
                            $message = $_POST['message'];
                            $from = $_POST['name'] . " <" . $_POST['email'] . ">";

                            if (mail ($to, $subject, $message, $from))
                            {
                                echo "Message sent successfully!";
                            }
                            else 
                            {
                                echo "There was an error sending the message!";
                            }
                        }
                    ?>
                </div>

			    <div class="clear"></div>
		    </div>
	    </div>
    </div>

    <div class="spacer"></div>
</body>

</html>
