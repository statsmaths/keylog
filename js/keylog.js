// Author: Taylor Arnold (tarnold2@richmond.edu)
// Date: 2021-04-27

// Create a global variable that stores all of the output data; initialize it
// with the header row fror a CSV file
var keys = [
  "time,type,key,key_code,alt_key,ctrl_key,meta_key,shift_key,is_repeat,range_start,range_end"
];
ibox = document.getElementById("lname");
ibox.value = '';

// Add a record when a key is pressed when focused on the textbox element.
// We will store it as a CSV file to make it easy to read into Excel or other
// programs. It would be more JavaScript oriented to do this as JSON.
ibox.addEventListener('keydown', (res) => {
  var key_name = (res.key === "," ? "\",\"" : res.key);
  if (key_name === "\"") { key_name = "\"\"\"\"" };
  if (key_name === "'") { key_name = "\"'\"" };
  if (key_name === ' ') { key_name = '\" \"' };

  keys.push(
    Date.now() + "," +
    "down," +
    key_name + "," +
    res.code + "," +
    res.altKey + "," +
    res.ctrlKey + "," +
    res.metaKey + "," +
    res.shiftKey + "," +
    res.repeat + "," +
    ibox.selectionStart + "," +
    ibox.selectionEnd
  )
});

// Add a record when a key is released when focused on the textbox element.
ibox.addEventListener('keyup', (res) => {
  var key_name = (res.key === "," ? "\",\"" : res.key);
  if (key_name === "\"") { key_name = "\"\"\"\"" };
  if (key_name === "'") { key_name = "\"'\"" };
  if (key_name === ' ') { key_name = '\" \"' };

  keys.push(
    Date.now() + "," +
    "up," +
    key_name + "," +
    res.code + "," +
    res.altKey + "," +
    res.ctrlKey + "," +
    res.metaKey + "," +
    res.shiftKey + "," +
    res.repeat + "," +
    ibox.selectionStart + "," +
    ibox.selectionEnd
  );
});

// Add a record when the mouse is clicked in the textbox element.
ibox.addEventListener('click', (res) => {
  keys.push(
    Date.now() + "," +
    "click,,," +
    res.altKey + "," +
    res.ctrlKey + "," +
    res.metaKey + "," +
    res.shiftKey + ",false," +
    ibox.selectionStart + "," +
    ibox.selectionEnd
  );
});

// Add a record when content is pasted into the box. Yes, this is possible on
// most modern browsers.
ibox.addEventListener('paste', (res) => {
  let content = res.clipboardData.getData("text");
  content = content.replace(/\"/g, "\"\"");

  keys.push(
    Date.now() + "," +
    "paste," +
    "\"" + content + "\"," +
    ",false,false,false,false,false," +
    ibox.selectionStart + "," +
    ibox.selectionEnd
  );
});

downloadLink = document.getElementById("downloadAnchorElem");
downloadLink.addEventListener('click', () => {
  var dataStr = "data:text/csv;charset=utf-8," +
                encodeURIComponent(keys.join('\n'));
  var dlAnchorElem = document.getElementById('downloadAnchorElem');
  let today = Date.now();

  downloadLink.setAttribute("href", dataStr);
  downloadLink.setAttribute("download", "keylogs-" + today + ".csv");
});

clearLink = document.getElementById("resetTexbox");
clearLink.addEventListener('click', () => {
  ibox.value = '';
  ibox.disabled = false;
});
