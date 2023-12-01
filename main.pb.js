routerAdd("POST", "/api/addUserLevel", async (c) => {
  try {
    const datas = $apis.requestInfo(c).data;
    let uId = datas.uId;
    let rId = datas.rId;
    let deviceId = datas.deviceId;
    var scourses = datas.course;
    var it = datas.it;
    $app.dao().runInTransaction((txDao) => {
      var collection = $app.dao().findCollectionByNameOrId("floor");
      var collection1 = $app.dao().findCollectionByNameOrId("history");
      var record = txDao.findRecordById("users", uId);
      var UserRecord = record;
      record = JSON.parse(JSON.stringify(record));
      let stotal = 30 * scourses.length;
      let admincost = stotal / 3;
      let refer = stotal / 6;
      let flevel = stotal / 6;
      let fleveld = stotal / 3;
      var reff = rId;
      var id = uId;
      var flag = false;
      var position;
      var data = txDao.findRecordById("users", rId);
      var ReferRecord = data;
      data = JSON.parse(JSON.stringify(data));
      var dtag = data;
      var floor = data.floor;
      while (floor.toString().length < 15) {
        floor = "0" + floor;
      }
      var floordata = txDao.findRecordById("floor", floor);
      floordata = JSON.parse(JSON.stringify(floordata));
      var ids = JSON.parse(floordata.ids);
      for (let i = 0; i < ids.length; i++) {
        if (ids[i] == reff) {
          position = [i];
        }
      }
      while (flag == false) {
        var nfloor = parseInt(floor) + 1;
        while (floor.toString().length < 15) {
          floor = "0" + floor;
        }
        while (nfloor.toString().length < 15) {
          nfloor = "0" + nfloor;
        }
        var floordata1;
        var nFloorfloordata1;
        let oks = true;
        try {
          floordata1 = txDao.findRecordById("floor", nfloor);
          nFloorfloordata1 = floordata1;
          floordata1 = JSON.parse(JSON.stringify(floordata1));
        } catch (e) {
          oks = false;
        }
        if (oks == false) {
          var n = Math.pow(3, parseInt(nfloor));
          var newArray = Array.from({ length: n }, (_, index) => " ");
          var id1 = position[0] * 3;
          newArray[id1] = id;
          const floorRecord = new Record(collection, {
            id: nfloor,
            ids: JSON.stringify(newArray),
          });
          txDao.saveRecord(floorRecord);

          UserRecord.set("floor", parseInt(nfloor));
          UserRecord.set("paid", true);
          UserRecord.set("course", JSON.stringify(scourses));
          txDao.saveRecord(UserRecord);

          var dtop = txDao.findRecordById("users", "3hlsg1ndkw4md1n");
          var adminRecord = dtop;
          dtop = JSON.parse(JSON.stringify(dtop));
          var floorr = parseInt(nfloor);
          while (floorr.toString().length < 15) {
            floorr = "0" + floorr;
          }
          var floorr1 = parseInt(nfloor) - 1;

          while (floorr1.toString().length < 15) {
            floorr1 = "0" + floorr1;
          }

          let adminCash = dtop.cwallet + admincost;
          let referCash = dtag.cwallet + refer;
          var dtop4 = txDao.findRecordById("floor", floorr1);
          dtop4 = JSON.parse(JSON.stringify(dtop4));
          let art = newArray;
          let art1 = JSON.parse(dtop4.ids);
          let ind = art.indexOf(uId);
          let pos = Math.floor(ind / 3);

          var dtop5 = txDao.findRecordById("users", art1[pos]);
          upperLeverRecord = dtop5;
          dtop5 = JSON.parse(JSON.stringify(dtop5));
          let flevelCash = dtop5.cwallet + flevel;
          let flevelDis = dtop5.dwallet + fleveld;
          var d1 = {
            cwallet:
              rId == "3hlsg1ndkw4md1n" && art1[pos] == "3hlsg1ndkw4md1n"
                ? adminCash + refer + flevel
                : rId == "3hlsg1ndkw4md1n"
                ? adminCash + refer
                : adminCash,
            dwallet:
              art1[pos] == "3hlsg1ndkw4md1n"
                ? dtop.dwallet + fleveld
                : dtop.dwallet,
          };
          var d2 = {
            cwallet: rId == art1[pos] ? referCash + flevel : referCash,
            dwallet: rId == art1[pos] ? dtag.dwallet + fleveld : dtag.dwallet,
          };

          var d3 = {
            cwallet: flevelCash,
            dwallet: flevelDis,
          };

          adminRecord.set("cwallet", d1.cwallet);
          adminRecord.set("dwallet", d1.dwallet);
          txDao.saveRecord(adminRecord);

          let body22 = {
            cid: uId,
            fid: art1[pos],
            rid: rId,
            adminf: admincost,
            rfee: refer,
            fidc: flevel,
            fidd: fleveld,
            total: scourses.length * 30,
            courses: JSON.stringify(scourses),
          };

          const historyRecord = new Record(collection1, body22);
          txDao.saveRecord(historyRecord);

          const waitRecord = txDao.findRecordById("waiting", it);
          txDao.deleteRecord(waitRecord);
          var util = txDao.findRecordById("util", "configallocator");
          var utils = JSON.parse(JSON.stringify(util));
          if (utils.deviceID == deviceId) {
            util.set("isLocked", false);
            util.set("deviceID", "");
            util.set("expirationTime", "");
            txDao.saveRecord(util);
          }

          if (rId != "3hlsg1ndkw4md1n") {
            ReferRecord.set("cwallet", d2.cwallet);
            ReferRecord.set("dwallet", d2.dwallet);
            txDao.saveRecord(ReferRecord);
          }
          if (art1[pos] != "3hlsg1ndkw4md1n" && rId != art1[pos]) {
            upperLeverRecord.set("cwallet", d3.cwallet);
            upperLeverRecord.set("dwallet", d3.dwallet);
            txDao.saveRecord(upperLeverRecord);
          }
          flag = true;
        } else {
          let ids1 = JSON.parse(floordata1.ids);
          let positions = [];
          let elements = [];
          for (
            var i = position[0] * 3;
            i <= position[position.length - 1] * 3 + 2;
            i++
          ) {
            positions.push(i);
            elements.push(ids1[i]);
          }
          let myArray = elements;
          const numRows = 3;
          var numCols = myArray.length / numRows;
          var flag1 = false;

          for (let row = 0; row < numRows && flag1 == false; row++) {
            for (let col = 0; col < numCols; col++) {
              let index = col * numRows + row;
              if (myArray[index] == " ") {
                myArray[index] = uId;
                for (var j = 0; j < positions.length; j++) {
                  ids1[positions[j]] = myArray[j];
                }
                nFloorfloordata1.set("ids", JSON.stringify(ids1));

                txDao.saveRecord(nFloorfloordata1);

                var data1 = {
                  floor: parseInt(nfloor),
                  paid: true,
                  course: JSON.stringify(scourses),
                };
                UserRecord.set("floor", data1.floor);
                UserRecord.set("paid", data1.paid);
                UserRecord.set("course", data1.course);
                txDao.saveRecord(UserRecord);

                var dtop = txDao.findRecordById("users", "3hlsg1ndkw4md1n");
                var adminRecord = dtop;
                dtop = JSON.parse(JSON.stringify(dtop));
                var floorr = parseInt(nfloor);
                while (floorr.toString().length < 15) {
                  floorr = "0" + floorr;
                }
                var floorr1 = parseInt(nfloor) - 1;

                while (floorr1.toString().length < 15) {
                  floorr1 = "0" + floorr1;
                }

                let adminCash = dtop.cwallet + admincost;
                let referCash = dtag.cwallet + refer;
                var dtop4 = txDao.findRecordById("floor", floorr1);
                dtop4 = JSON.parse(JSON.stringify(dtop4));
                let art = ids1;
                let art1 = JSON.parse(dtop4.ids);
                let ind = art.indexOf(uId);
                let pos = Math.floor(ind / 3);

                var dtop5 = txDao.findRecordById("users", art1[pos]);
                var upperLeverRecord = dtop5;
                dtop5 = JSON.parse(JSON.stringify(dtop5));
                let flevelCash = dtop5.cwallet + flevel;
                let flevelDis = dtop5.dwallet + fleveld;
                var d1 = {
                  cwallet:
                    rId == "3hlsg1ndkw4md1n" && art1[pos] == "3hlsg1ndkw4md1n"
                      ? adminCash + refer + flevel
                      : rId == "3hlsg1ndkw4md1n"
                      ? adminCash + refer
                      : adminCash,
                  dwallet:
                    art1[pos] == "3hlsg1ndkw4md1n"
                      ? dtop.dwallet + fleveld
                      : dtop.dwallet,
                };
                var d2 = {
                  cwallet: rId == art1[pos] ? referCash + flevel : referCash,
                  dwallet:
                    rId == art1[pos] ? dtag.dwallet + fleveld : dtag.dwallet,
                };

                var d3 = {
                  cwallet: flevelCash,
                  dwallet: flevelDis,
                };
                adminRecord.set("cwallet", d1.cwallet);
                adminRecord.set("dwallet", d1.dwallet);
                txDao.saveRecord(adminRecord);

                let body22 = {
                  cid: uId,
                  fid: art1[pos],
                  rid: rId,
                  adminf: admincost,
                  rfee: refer,
                  fidc: flevel,
                  fidd: fleveld,
                  total: scourses.length * 30,
                  courses: JSON.stringify(scourses),
                };

                const historyRecord = new Record(collection1, body22);
                txDao.saveRecord(historyRecord);

                const waitRecord = txDao.findRecordById("waiting", it);
                txDao.deleteRecord(waitRecord);
                var util = txDao.findRecordById("util", "configallocator");
                var utils = JSON.parse(JSON.stringify(util));
                if (utils.deviceID == deviceId) {
                  util.set("isLocked", false);
                  util.set("deviceID", "");
                  util.set("expirationTime", "");
                  txDao.saveRecord(util);
                }

                if (rId != "3hlsg1ndkw4md1n") {
                  ReferRecord.set("cwallet", d2.cwallet);
                  ReferRecord.set("dwallet", d2.dwallet);
                  txDao.saveRecord(ReferRecord);
                }
                if (art1[pos] != "3hlsg1ndkw4md1n" && rId != art1[pos]) {
                  upperLeverRecord.set("cwallet", d3.cwallet);
                  upperLeverRecord.set("dwallet", d3.dwallet);
                  txDao.saveRecord(upperLeverRecord);
                }
                console.log(art1[pos]);
                flag1 = true;
                flag = true;
                break;
              }
            }
          }
          floor = parseInt(floor) + 1;
          position = positions;
          floordata = floordata1;
        }
      }
    });
    return c.json(200, { message: "Ok" });
  } catch (e) {
    return c.json(201, { message: "404 Error!" + e });
  }
});

routerAdd("POST", "/api/buyCourse", async (c) => {
  try {
    const datas = $apis.requestInfo(c).data;
    let uId = datas.uId;
    let rId = datas.rId;
    let it = datas.it;
    var scourses = datas.course;
    $app.dao().runInTransaction((txDao) => {
      var collection1 = $app.dao().findCollectionByNameOrId("history");
      var record = txDao.findRecordById("users", uId);
      var UserRecord = record;
      record = JSON.parse(JSON.stringify(record));
      let floor = record.floor;
      var ct = JSON.parse(record.course1=""? record.course : '[]');
      ct = [...ct, ...scourses];
    
      UserRecord.set("course", JSON.stringify(ct));
      txDao.saveRecord(UserRecord);
      const waitRecord = txDao.findRecordById("waiting", it);
      txDao.deleteRecord(waitRecord);

      let stotal = 30 * scourses.length;
      let admincost = stotal / 3;
      let refer = stotal / 6;
      let flevel = stotal / 6;
      let fleveld = stotal / 3;

      var dtag = txDao.findRecordById("users", rId);
      var referRecord = dtag;
      dtag = JSON.parse(JSON.stringify(dtag));

      var dtop = txDao.findRecordById("users", "3hlsg1ndkw4md1n");
      var adminRecord = dtop;
      dtop = JSON.parse(JSON.stringify(dtop));
      var floorr = floor;
      while (floorr.toString().length < 15) {
        floorr = "0" + floorr;
      }
      var floorr1 = floor - 1;
      while (floorr1.toString().length < 15) {
        floorr1 = "0" + floorr1;
      }
      var floordata = txDao.findRecordById("floor", floorr);
      floordata = JSON.parse(JSON.stringify(floordata));
      var floordata1 = txDao.findRecordById("floor", floorr1);
      floordata1 = JSON.parse(JSON.stringify(floordata1));

      let jsonString = floordata.ids;
      let ids = JSON.parse(jsonString);

      let adminCash = dtop.cwallet + admincost;
      let referCash = dtag.cwallet + refer;
      let art = ids;
      let art1 = JSON.parse(floordata1.ids);
      let ind = art.indexOf(uId);
      let pos = Math.floor(ind / 3);
      var dtop5 = txDao.findRecordById("users", art1[pos]);
      var upperLeverRecord = dtop5;
      dtop5 = JSON.parse(JSON.stringify(dtop5));
      let flevelCash = dtop5.cwallet + flevel;
      let flevelDis = dtop5.dwallet + fleveld;

      var d1 = {
        cwallet:
          rId == "3hlsg1ndkw4md1n" && art1[pos] == "3hlsg1ndkw4md1n"
            ? adminCash + refer + flevel
            : rId == "3hlsg1ndkw4md1n"
            ? adminCash + refer
            : adminCash,
        dwallet:
          art1[pos] == "3hlsg1ndkw4md1n"
            ? dtop.dwallet + fleveld
            : dtop.dwallet,
      };
      var d2 = {
        cwallet: rId == art1[pos] ? referCash + flevel : referCash,
        dwallet: rId == art1[pos] ? dtag.dwallet + fleveld : dtag.dwallet,
      };

      var d3 = {
        cwallet: flevelCash,
        dwallet: flevelDis,
      };

      adminRecord.set("cwallet", d1.cwallet);
      adminRecord.set("dwallet", d1.dwallet);
      txDao.saveRecord(adminRecord);

      let body22 = {
        cid: uId,
        fid: art1[pos],
        rid: rId,
        adminf: admincost,
        rfee: refer,
        fidc: flevel,
        fidd: fleveld,
        total: scourses.length * 30,
        courses: JSON.stringify(scourses),
      };

      const historyRecord = new Record(collection1, body22);
      txDao.saveRecord(historyRecord);

      if (rId != "3hlsg1ndkw4md1n") {
        referRecord.set("cwallet", d2.cwallet);
        referRecord.set("dwallet", d2.dwallet);
        txDao.saveRecord(referRecord);
      }
      if (art1[pos] != "3hlsg1ndkw4md1n" && rId != art1[pos]) {
        upperLeverRecord.set("cwallet", d3.cwallet);
        upperLeverRecord.set("dwallet", d3.dwallet);
        txDao.saveRecord(upperLeverRecord);
      }
    });
    return c.json(200, { message: "Ok" });
  } catch (e) {
    return c.json(201, { message: "404 Error!" + e });
  }
});
