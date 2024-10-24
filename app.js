var newMemberAddBtn = document.querySelector('.addMemberBtn'),
darkBg = document.querySelector('.dark_bg'),
popupForm = document.querySelector('.popup'),
crossBtn = document.querySelector('.closeBtn'),
submitBtn = document.querySelector('.submitBtn'),
 modalTitle = document.querySelector('.modalTitle'),
 popupFooter = document.querySelector('.popupFooter'),
 imgInput = document.querySelector('.img'),
 imgHolder = document.querySelector('.imgholder')
 form = document.querySelector('form'),
 formInputFields = document.querySelectorAll('form input'),
  uploadimg = document.querySelector("#uploadimg"),
  fName = document.getElementById("fName"),
  lName = document.getElementById("lName"),
  age = document.getElementById("age"),
  city = document.getElementById("city"),
  position = document.getElementById("position"),
  salary = document.getElementById("salary"),
  sDate = document.getElementById("sDate"),
  email = document.getElementById("email"),
  phone = document.getElementById("phone"),
  entries = document.querySelector(".showEntries"),
  tabSize = document.getElementById("table_size"),
  userInfo = document.querySelector(".userInfo"),
  table = document.querySelector("table"),
  filterData = document.getElementById("search")

// let originalData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : []
// let getData = [...originalData]
let originalData = [];
let getData = [];


let isEdit = false, editId

var arrayLength = 0
var tableSize = 10
var startIndex = 1
var endIndex = 0
var currentIndex = 1
var maxIndex = 0

showInfo()

async function fetchData() {
    try {
        const response = await fetch('https://67186c67b910c6a6e02c0b6e.mockapi.io/users');
        originalData = await response.json();
        getData = [...originalData];
        showInfo();  
        displayIndexBtn();  
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();


newMemberAddBtn.addEventListener('click', ()=> {
    isEdit = false
    submitBtn.innerHTML = "Submit"
    modalTitle.innerHTML = "Fill the Form"
    popupFooter.style.display = "block"
    imgInput.src = "./img/pic1.png"
    darkBg.classList.add('active')
    popupForm.classList.add('active')
})

crossBtn.addEventListener('click', ()=>{
    darkBg.classList.remove('active')
    popupForm.classList.remove('active')
    form.reset()
})

uploadimg.onchange = function(){
    if(uploadimg.files[0].size < 1000000){   // 1MB = 1000000
        var fileReader = new FileReader()

        fileReader.onload = function(e){
            var imgUrl = e.target.result
            imgInput.src = imgUrl
        }

        fileReader.readAsDataURL(uploadimg.files[0])
    }

    else{
        alert("This file is too large!")
    }

}

function preLoadCalculations(){
    array = getData
    arrayLength = array.length
    maxIndex = arrayLength / tableSize

    if((arrayLength % tableSize) > 0){
        maxIndex++
    }
}



function displayIndexBtn(){
    preLoadCalculations()

    const pagination = document.querySelector('.pagination')

    pagination.innerHTML = ""

    pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>'

    for(let i=1; i<=maxIndex; i++){
        pagination.innerHTML += '<button onclick= "paginationBtn('+i+')" index="'+i+'">'+i+'</button>'
    }

    pagination.innerHTML += '<button onclick="next()" class="next">Next</button>'

    highlightIndexBtn()
}


function highlightIndexBtn(){
    startIndex = ((currentIndex - 1) * tableSize) + 1
    endIndex = (startIndex + tableSize) - 1

    if(endIndex > arrayLength){
        endIndex = arrayLength
    }

    if(maxIndex >= 2){
        var nextBtn = document.querySelector(".next")
        nextBtn.classList.add("act")
    }


    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`

    var paginationBtns = document.querySelectorAll('.pagination button')
    paginationBtns.forEach(btn => {
        btn.classList.remove('active')
        if(btn.getAttribute('index') === currentIndex.toString()){
            btn.classList.add('active')
        }
    })


    showInfo()
}

function showInfo() {
    // Xóa tất cả các dòng hiện có trong bảng
    document.querySelectorAll(".employeeDetails").forEach(info => info.remove());

    // Tính chỉ số bắt đầu và kết thúc cho phân trang
    var tab_start = startIndex - 1; // Chỉ số bắt đầu (bắt đầu từ 0)
    var tab_end = endIndex; // Chỉ số kết thúc (không bao gồm)

    // Kiểm tra xem có dữ liệu hay không
    if (getData.length > 0) {
        for (var i = tab_start; i < tab_end && i < getData.length; i++) { 
            var staff = getData[i];

            if (staff) {
                let createElement = `<tr class="employeeDetails">
                    <td>${i + 1}</td>
                    <td><img src="${staff.picture}" alt="" width="40" height="40"></td>
                    <td>${staff.fName + " " + staff.lName}</td>
                    <td>${staff.ageVal}</td>
                    <td>${staff.cityVal}</td>
                    <td>${staff.positionVal}</td>
                    <td>${staff.salaryVal}</td>
                    <td>${staff.sDateVal}</td>
                    <td>${staff.emailVal}</td>
                    <td>${staff.phoneVal}</td>
                    <td>
                        <button onclick="readInfo('${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.ageVal}', '${staff.cityVal}', '${staff.positionVal}', '${staff.salaryVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-eye"></i></button>
                        <button onclick="editInfo('${i}', '${staff.picture}', '${staff.fName}', '${staff.lName}', '${staff.ageVal}', '${staff.cityVal}', '${staff.positionVal}', '${staff.salaryVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button onclick="deleteInfo(${i})"><i class="fa-regular fa-trash-can"></i></button>
                    </td>
                </tr>`;

                userInfo.innerHTML += createElement; 
                table.style.minWidth = "1400px"; 
            }
        }
    } else {
       
        userInfo.innerHTML = `<tr class="employeeDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`;
        table.style.minWidth = "1400px";
    }
}


showInfo()


function readInfo(pic, fname, lname, Age, City, Position, Salary, SDate, Email, Phone){
    // imgInput.src = pic
    imgInput.src = pic && pic !== "undefined" ? pic : DEFAULT_IMAGE;
    imgInput.onerror = () => imgInput.src = DEFAULT_IMAGE;
    fName.value = fname
    lName.value = lname
    age.value = Age
    city.value = City
    position.value = Position
    salary.value = Salary
    sDate.value = SDate
    email.value = Email
    phone.value = Phone

    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "none"
    modalTitle.innerHTML = "Profile"
    formInputFields.forEach(input => {
        input.disabled = true
    })


    imgHolder.style.pointerEvents = "none"
}

function editInfo(id, pic, fname, lname, Age, City, Position, Salary, SDate, Email, Phone){
    isEdit = true
    editId = id

    // Find the index of the item to edit in the original data based on id
    const originalIndex = originalData.findIndex(item => item.id === id)

    // Update the original data
    originalData[originalIndex] = {
        id: id,
        picture: pic,
        fName: fname,
        lName: lname,
        ageVal: Age,
        cityVal: City,
        positionVal: Position,
        salaryVal: Salary,
        sDateVal: SDate,
        emailVal: Email,
        phoneVal: Phone
    }

    // imgInput.src = pic
    imgInput.src = pic && pic !== "undefined" ? pic : DEFAULT_IMAGE;
    imgInput.onerror = () => imgInput.src = DEFAULT_IMAGE;
    fName.value = fname
    lName.value = lname
    age.value = Age
    city.value = City
    position.value = Position
    salary.value = Salary
    sDate.value = SDate
    email.value = Email
    phone.value = Phone


    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "block"
    modalTitle.innerHTML = "Update the Form"
    submitBtn.innerHTML = "Update"
    formInputFields.forEach(input => {
        input.disabled = false
    })


    imgHolder.style.pointerEvents = "auto"
}

async function deleteInfo(index) {
    if (confirm("Are you sure want to delete?")) {
        const userId = originalData[index].id;

   
        await fetch(`https://67186c67b910c6a6e02c0b6e.mockapi.io/users/${userId}`, {
            method: 'DELETE'
        });

        originalData.splice(index, 1);
        getData = [...originalData];

        preLoadCalculations();

        if (getData.length === 0) {
            currentIndex = 1;
            startIndex = 1;
            endIndex = 0;
        } else if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        showInfo();
        highlightIndexBtn();
        displayIndexBtn();

        var nextBtn = document.querySelector('.next');
        var prevBtn = document.querySelector('.prev');

        if (Math.floor(maxIndex) > currentIndex) {
            nextBtn.classList.add("act");
        } else {
            nextBtn.classList.remove("act");
        }

        if (currentIndex > 1) {
            prevBtn.classList.add('act');
        }
    }
}


form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const information = {
        picture: imgInput.src == undefined ? "./img/pic1.png" : imgInput.src,
        fName: fName.value,
        lName: lName.value,
        ageVal: age.value,
cityVal: city.value,
        positionVal: position.value,
        salaryVal: salary.value,
        sDateVal: sDate.value,
        emailVal: email.value,
        phoneVal: phone.value
    };

    if (!isEdit) {
        
        const response = await fetch('https://67186c67b910c6a6e02c0b6e.mockapi.io/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(information)
        });
        const newUser = await response.json();
        originalData.unshift(newUser);  // Thêm dữ liệu mới vào mảng
    } else {
        // Cập nhật thông tin nhân viên qua API PUT
        const userIdId = originalData[editId].id;
        const response = await fetch(`https://67186c67b910c6a6e02c0b6e.mockapi.io/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(information)
        });
        const updatedUser = await response.json();
        originalData[editId] = updatedUser;  
    }

    getData = [...originalData];

    // Cập nhật giao diện
    submitBtn.innerHTML = "Submit";
    modalTitle.innerHTML = "Fill the Form";

    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();

    highlightIndexBtn();
    displayIndexBtn();
    showInfo();

    var nextBtn = document.querySelector(".next");
    var prevBtn = document.querySelector(".prev");
    if (Math.floor(maxIndex) > currentIndex) {
        nextBtn.classList.add("act");
    } else {
        nextBtn.classList.remove("act");
    }

    if (currentIndex > 1) {
        prevBtn.classList.add("act");
    }
});



function next(){
    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    if(currentIndex <= maxIndex - 1){
        currentIndex++
        prevBtn.classList.add("act")

        highlightIndexBtn()
    }

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove("act")
    }
}


function prev(){
    var prevBtn = document.querySelector('.prev')

    if(currentIndex > 1){
        currentIndex--
        prevBtn.classList.add("act")
        highlightIndexBtn()
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}


function paginationBtn(i){
    currentIndex = i

    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    highlightIndexBtn()

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove('act')
    }
    else{
        nextBtn.classList.add("act")
    }


    if(currentIndex > 1){
        prevBtn.classList.add("act")
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}



tabSize.addEventListener('change', ()=>{
    var selectedValue = parseInt(tabSize.value)
    tableSize = selectedValue
    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})



filterData.addEventListener("input", ()=> {
    const searchTerm = filterData.value.toLowerCase().trim()

    if(searchTerm !== ""){

        const filteredData = originalData.filter((item) => {
            const fullName = (item.fName + " " + item.lName).toLowerCase()
            const city = item.cityVal.toLowerCase()
            const position = item.positionVal.toLowerCase()

            return(
                fullName.includes(searchTerm) ||
                city.includes(searchTerm) ||
                position.includes(searchTerm)
            )
        })

        // Update the current data with filtered data
        getData = filteredData
    }

    else{
        getData = JSON.parse(localStorage.getItem('userProfile')) || []
    }


    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})
let currentSortColumn = null; 
let currentSortOrder = 'asc'; 

function sortTable(columnName) {
    
    if (currentSortColumn === columnName) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'; 
    } else {
        currentSortOrder = 'asc'; 
        currentSortColumn = columnName; 
    }

    // Sắp xếp dữ liệu
    getData.sort((a, b) => {
        let valA, valB;

        // Lấy giá trị tùy thuộc vào cột
        if (columnName === 'name') {
            valA = a.fName + ' ' + a.lName;
            valB = b.fName + ' ' + b.lName;
        } else if (columnName === 'age') {
            valA = a.ageVal; // Tuổi
            valB = b.ageVal;
        } else if (columnName === 'salary') {
            valA = parseFloat(a.salaryVal); // Lương
            valB = parseFloat(b.salaryVal);
        } else if (columnName === 'city') {
            valA = a.cityVal.toLowerCase(); 
            valB = b.cityVal.toLowerCase();
        } else if (columnName === 'position') {
            valA = a.positionVal.toLowerCase(); // Vị trí
            valB = b.positionVal.toLowerCase();
        } else if (columnName === 'email') {
            valA = a.emailVal.toLowerCase(); // Email
            valB = b.emailVal.toLowerCase();
        } else if (columnName === 'startDate') {
            valA = new Date(a.sDateVal); // Ngày bắt đầu
            valB = new Date(b.sDateVal);
        }

        // So sánh theo thứ tự
        if (currentSortOrder === 'asc') {
            return valA > valB ? 1 : -1; // Sắp xếp tăng dần
        } else {
            return valA < valB ? 1 : -1; // Sắp xếp giảm dần
        }
    });

    showInfo(); // Cập nhật hiển thị bảng sau khi sắp xếp
}

const tableHeaders = document.querySelectorAll("table thead th");
tableHeaders.forEach(header => {
    if (header.innerText === "Full Name") {
        header.addEventListener("click", () => sortTable('name')); // Sắp xếp theo tên
    } else if (header.innerText === "Age") {
        header.addEventListener("click", () => sortTable('age')); // Sắp xếp theo tuổi
    } else if (header.innerText === "Salary") {
        header.addEventListener("click", () => sortTable('salary')); // Sắp xếp theo lương
    } else if (header.innerText === "City") {
        header.addEventListener("click", () => sortTable('city')); // Sắp xếp theo thành phố
    } else if (header.innerText === "Position") {
        header.addEventListener("click", () => sortTable('position')); // Sắp xếp theo vị trí
    } else if (header.innerText === "Email") {
        header.addEventListener("click", () => sortTable('email')); // Sắp xếp theo email
    } else if (header.innerText === "Start Date") {
        header.addEventListener("click", () => sortTable('startDate')); // Sắp xếp theo ngày bắt đầu
    }
});



displayIndexBtn()