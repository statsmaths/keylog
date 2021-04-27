var keys = [
  "time,type,key,key_code,alt_key,ctrl_key,meta_key,shift_key,range_start,range_end"
];
ibox = document.getElementById("lname");
ibox.value = '';
ibox.addEventListener('keydown', (res) => {
  var key_name = (res.key === "," ? "\",\"" : res.key);
  if (key_name === "'") { key_name = "DoubleQuote" };
  if (key_name === '"') { key_name = 'SingleQuote' };
  if (key_name === ' ') { key_name = 'Space' };

  keys.push(
    Date.now() + "," +
    "down," +
    key_name + "," +
    res.keyCode + "," +
    res.altKey + "," +
    res.ctrlKey + "," +
    res.metaKey + "," +
    res.shiftKey + ",,"
  )
});
ibox.addEventListener('keyup', (res) => {
  var key_name = (res.key === "," ? "\",\"" : res.key);
  if (key_name === "'") { key_name = "DoubleQuote" };
  if (key_name === '"') { key_name = 'SingleQuote' };
  if (key_name === ' ') { key_name = 'Space' };

  keys.push(
    Date.now() + "," +
    "up," +
    key_name + "," +
    res.keyCode + "," +
    res.altKey + "," +
    res.ctrlKey + "," +
    res.metaKey + "," +
    res.shiftKey + ",,"
  );
});
ibox.addEventListener('click', (res) => {
  keys.push(
    Date.now() + "," +
    "click,,," +
    res.altKey + "," +
    res.ctrlKey + "," +
    res.metaKey + "," +
    res.shiftKey + "," +
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
