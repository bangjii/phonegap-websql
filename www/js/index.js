        /*
			dbname: mydb
			table:	1. trans_log : id_trans(int), key(varchar), notes(text)
		*/
        // window.openDatabase("database-name","version","database description","database size in bytes")
        var db = window.openDatabase("mydb", "1.0", "my experimental database", 1000000); //will create database or open it
      	document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {
            // Create Table
            db.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS trans_log (id_trans INTEGER PRIMARY KEY AUTOINCREMENT, key VARCHAR, notes TEXT)');
			}, errorCB, successCB);
            // Select records
            fetchData();
		}

        // Fetch all records
        function fetchData(){
            db.transaction(function(tx){
				tx.executeSql("select * from trans_log",[],function(tx1,result){
					var len = result.rows.length;
					var ul = document.getElementById("list");
					ul.innerHTML = '';
					for (var i=0; i<len; i++){
                        var id = result.rows.item(i).id_trans;
                        var key = result.rows.item(i).key;
                        var note = result.rows.item(i).notes;

                        // Add list item
						var text = "Id: " + id + " | Key: " + key + " | Note: " + note;
						var li = document.createElement("li");
                        li.appendChild(document.createTextNode(text));
                        ul.appendChild(li);
                    }
				},errorCB);
			}, errorCB, successCB);
        }
     
        function insertData(){
            db.transaction(function(tx){
				var key = document.getElementById('key').value;
				var note = document.getElementById('note').value;
				tx.executeSql("INSERT INTO trans_log(key, notes) VALUES (?,?)",[key,note]);
				fetchData();
				document.getElementById('key').value = "";
				document.getElementById('note').value = "";
			}, errorCB, successCB);
        }
		function del(){
			var k = document.getElementById('uKey').value;
			deleteID(k);
		}
		function upd(){
			var k = document.getElementById('uuKey').value;
			var v = document.getElementById('uVal').value;
			updateID(k,v);
		}
		function deleteID(userKey){
            db.transaction(function(tx){
				tx.executeSql("delete from trans_log where key = " + userKey);   
				fetchData();
			}, errorCB, successCB);
        }
		function updateID(userKey, valKey){
            db.transaction(function(tx){
				tx.executeSql("update trans_log set notes = '" + valKey + "' where key = '" + userKey + "'");   
				fetchData();
			}, errorCB, successCB);
        }
		function clearData(){
            db.transaction(function(tx){
				tx.executeSql("delete from trans_log");   
				fetchData();
			}, errorCB, successCB);
        }
		function resetData(){
            db.transaction(function(tx){
				tx.executeSql("delete from trans_log");   
				tx.executeSql("update sqlite_sequence set seq = 0 where name = 'trans_log'");   
				fetchData();
			}, errorCB, successCB);
        }

		//-------------------------------------------
        function errorCB(err) {
            alert("Error processing SQL: "+err.code);
        }
        function successCB() {
        //    alert("success!");
        }		
