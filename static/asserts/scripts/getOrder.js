var xhr = new XMLHttpRequest(),
    jsonArr,
    method = "GET",
    jsonRequestURL = "..../bd/jsonFile/order.json";

xhr.open(method, jsonRequestURL, true);
xhr.onreadystatechange = function()
{
    var name = document.forms["form_input"].elements["name"].value;
    var vk_id = document.forms["form_input"].elements["vk"].value;
    var mail = document.forms["form_input"].elements["mail"].value;
    var count = 0;

    jsonbd = {
        name: name,
        vk: vk_id,
        mail: mail
    }

    if(xhr.readyState == 4 && xhr.status == 200){
        jsonArr = JSON.parse(xhr.responseText);
        jsonArr.push({jsonbd});
        xhr.open("POST", jsonRequestURL, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        xhr.send("jsonTxt="+JSON.stringify(jsonArr));
    }
};