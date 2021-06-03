// searchNameForm form
const searchNameForm = document.querySelector(".searchNameForm");

// tableBody.
const tBody = document.querySelector('#tableBody');

// listening to form submission.
searchNameForm.onsubmit = (e) => {
    e.preventDefault();
    let name = e.target[0].value;
    let id = e.target[1].value;

    AJAX(
        `/admin/customers/getCustomer/${name}/${id}`,
        (resData) => {
            addTableContent(resData.tableData)
        },
        (err) => {
            alert("Couldn't Find the customer.\nPlease try again.");
        }
    )
};
let addTableContent = (resData) => {
    let tableContent = `<tr>
                            <td>
                                <div data-id='${resData._id}' class="checkbox">
                                    <span class="material-icons">check</span>
                                </div>
                            </td>
                            <td class="tName">${resData.name}</td>
                            <td class="tPhone">${resData.phone}</td>
                            <td class="tTime">
                                entry time : ${resData.entryTime} 
                                <br>
                                exit time : ${resData.exitTime}
                            </td>
                            <td class="tPlace">${resData.place}</td>
                            <td class="txt-center tOption">
                                <a href="/admin/customers/oneCustomerFilter/${resData._id}">filter</a>
                            </td>
                        </tr>`
    tBody.innerHTML = tableContent;
};