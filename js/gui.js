$("#SetFen").click(function () {
  var fenStr = $("#fenIn").val();
  ParseFen(fenStr);
  PrintBoard();
  SearchPosition();
});
