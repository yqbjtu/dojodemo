<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix = "c" %>

<html>
   <head>
      <title>c:import Tag Example</title>
   </head>

   <body>
      <c:import var = "data" url = "http://www.baidu.com"/>
      <c:out value = "${data}"/>
   </body>
</html>