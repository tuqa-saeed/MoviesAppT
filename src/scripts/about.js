const teamData = [
    {
        "name": "Mohammad Shoubash",
        "role": "Scrum Master",
        "description": "Full Stack development",
         "image": "../images/img-team/img/mohammad shoubash.JPG"
    },
    {
        "name": "Mohammad Jamal",
        "role": "Product Owner",
        "description": "Full Stack development",
        "image": "../images/img-team/img/mohamm.png"
    },
    {
        "name": "Qutaiba ALSinjlawi",
        "role": "Development team",
        "description": "Full Stack development",
        "image": "../images/img-team/img/Qut.png"
    },
    {
        "name": "tuqa Saeed",
        "role": "Development team",
        "description": "Full Stack development",
        "image": "../images/img-team/img/tuq.png"
    },
    {
        "name": "Heba altayeb",
        "role": "Development team",
        "description": "Full Stack development",
        "image": "../images/img-team/img/d21e896d-3020-4489-b8d1-9fc220c2619e.jpg"
    }


];
const teamContainer = document.getElementById('team-container');

// إنشاء وظيفة لإنشاء كل بطاقة عضو في الفريق
function createTeamCard(member) {
    const card = document.createElement('div');
    card.classList.add('team-card');

    // إضافة الصورة
    const img = document.createElement('img');
    img.src = member.image;
    card.appendChild(img);

    // إضافة الاسم والدور
    const name = document.createElement('h3');
    name.textContent = member.name;
    card.appendChild(name);

    const role = document.createElement('p');
    role.textContent = member.role;
    card.appendChild(role);

    // إضافة زر "عرض المزيد"
    const button = document.createElement('button');
    button.textContent = 'See More';
    button.addEventListener('click', () => toggleDescription(card, member.description));
    card.appendChild(button);

    // إضافة الوصف الذي سيكون مخفيًا في البداية
    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = member.description;
    card.appendChild(description);

    // إضافة البطاقة إلى الحاوية
    teamContainer.appendChild(card);
}

// وظيفة لإظهار أو إخفاء الوصف عند الضغط على الزر
function toggleDescription(card, descriptionText) {
    const description = card.querySelector('.description');
    description.style.display = description.style.display === 'none' ? 'block' : 'none';
}

// عرض كل أعضاء الفريق
teamData.forEach(member => {
    createTeamCard(member);
});


const text = "About Us";
        let index = 0;

        function typeEffect() {
            if (index < text.length) {
                document.getElementById("typing").textContent += text.charAt(index);
                index++;
                setTimeout(typeEffect, 100); // التأخير بين الحروف (100 ملي ثانية)
            }
        }

        // بدء تأثير الكتابة عند تحميل الصفحة
        window.onload = typeEffect;


