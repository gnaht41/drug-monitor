let url = location.host;//so it works locally and online

$("table").rtResponsiveTables();//for the responsive tables plugin

$("#add_drug").submit(function (event) {
    event.preventDefault();
    var data = $(this).serialize();
    $.post("/api/drugs", data).done(function (response) {
        alert("Drug added successfully!");
        window.location.href = "/manage";
    });
});



$("#update_drug").submit(function (event) {// on clicking submit
    event.preventDefault();//prevent default submit behaviour

    //var unindexed_array = $("#update_drug");
    var unindexed_array = $(this).serializeArray();//grab data from form
    var data = {}

    $.map(unindexed_array, function (n, i) {//assign keys and values from form data
        data[n['name']] = n['value']
    })


    var request = {//use a put API request to use data from above to replace what's on database
        "url": `/api/drugs/${data.id}`,
        "method": "PUT",
        "data": data
    }

    $.ajax(request).done(function (response) {
        alert(data.name + " Updated Successfully!");
        window.location.href = "/manage";//redirects to index after alert is closed
    })

})

if (window.location.pathname == "/manage") {//since items are listed on manage
    $ondelete = $("table tbody td a.delete"); //select the anchor with class delete
    $ondelete.click(function () {//add click event listener
        let id = $(this).attr("data-id") // pick the value from the data-id

        let request = {//save API request in variable
            "url": `/api/drugs/${id}`,
            "method": "DELETE"
        }

        if (confirm("Do you really want to delete this drug?")) {// bring out confirm box
            $.ajax(request).done(function (response) {// if confirmed, send API request
                alert("Drug deleted Successfully!");//show an alert that it's done
                location.reload();//reload the page
            })
        }

    })
}

if (window.location.pathname == "/purchase") {
    //$("#purchase_table").hide();

    $("#drug_days").submit(function (event) {//on a submit event on the element with id add_drug
        event.preventDefault();//prevent default submit behaviour
        $("#purchase_table").show();
        const days = +$("#days").val();
        alert("Drugs for " + days + " days!");//alert this in the browser
        fetch(`/api/purchase?days=${days}`)
            .then(res => res.json())
            .then(data => {
                const $tbody = $("#purchase_table tbody");
                $tbody.empty();

                data.items.forEach((it, idx) => {
                    // Tính ratio pack/card để hiển thị như EJS cũ
                    // (giữ nguyên logic, chỉ là format text ở client)
                    let ratioText = "";
                    if (typeof it.pack === "number" && typeof it.card === "number" && it.card > 0) {
                        const ratio = it.pack / it.card;
                        ratioText = ` (${ratio} ${ratio < 2 ? "card" : "cards"} per pack)`;
                    }

                    $tbody.append(`
          <tr>
            <td>${idx + 1}</td>
            <td>${it.name}</td>
            <td>${it.cardsToBuy}${ratioText}</td>
            <td>${it.packsToBuy}</td>
          </tr>
        `);
                });

                $("#purchase_table").show();
            })
            .catch(err => {
                alert("Cannot calculate purchase");
                console.error(err);
            });
    })
}
