document.addEventListener("DOMContentLoaded", function () {
  // ========== SIGNUP FORM ==========
  const signupForm = document.querySelector("#signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.querySelector("#signupEmail")?.value.trim();
      const username = document.querySelector("#signupUsername")?.value.trim();
      const password = document.querySelector("#signupPassword")?.value.trim();
      const confirmPassword = document.querySelector("#signupConfirmPassword")?.value.trim();
      const dob = document.querySelector("#signupDob")?.value;
      const phone = document.querySelector("#signupPhone")?.value.trim();
      const address = document.querySelector("#signupAddress")?.value.trim();
      const errorDiv = document.querySelector("#signupError");
      const successDiv = document.querySelector("#signupSuccess");
      const errors = [];

      // VALIDATION SECTION
      if (!email || !email.includes("@")) errors.push("Email must include '@'.");
      if (!password || password.length < 6) errors.push("Password must be at least 6 characters.");
      if (password !== confirmPassword) errors.push("Passwords do not match.");
      if (!dob) errors.push("Date of birth is required.");
      if (phone && !/^\d+$/.test(phone)) errors.push("Phone must be numeric.");
      if (phone && phone.length > 10) errors.push("Phone must be 10 digits or fewer.");
      if (!username) errors.push("Username is required.");

      if (errors.length > 0) {
        errorDiv.innerHTML = errors.map(e => `<p class="text-danger">${e}</p>`).join("");
        return;
      }

      errorDiv.innerHTML = ""; // clear previous errors

      fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, dob, phone, address })
      })
        .then(async (res) => {
          const data = await res.json();
          errorDiv.innerHTML = "";
          successDiv.innerHTML = "";

          if (res.ok && data.redirect) {
            successDiv.innerHTML = `<p>Sign up successful! Redirecting to home...</p>`;
            signupForm.reset();
            setTimeout(() => {
              window.location.href = data.redirect;
            }, 1500);
          } else if (res.ok) {
            successDiv.innerHTML = `<p>Sign up successful! You can now <a href="/login.html">log in</a>.</p>`;
            signupForm.reset();
          } else {
            errorDiv.innerHTML = `<p class="text-danger">${data.error || "An unknown error occurred."}</p>`;
          }
        })
        .catch((err) => {
          errorDiv.innerHTML = `<p class="text-danger">Fetch error: ${err.message}</p>`;
        });
    });
  }
  // ========== CONTACT FORM ==========
  const contactForm = document.querySelector("#contactForm");
  const contactError = document.querySelector("#errorMsg");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      const name = document.querySelector("#name")?.value.trim();
      const email = document.querySelector("#email")?.value.trim();
      const phone = document.querySelector("#phone")?.value.trim();
      const message = document.querySelector("#message")?.value.trim();
      const errors = [];

      if (!name) errors.push("Name is required.");
      if (!email.includes("@")) errors.push("Email must include '@'.");
      if (!/^\d+$/.test(phone)) errors.push("Phone must be numeric.");
      if (phone.length > 10) errors.push("Phone must be max 10 digits.");
      if (!message) errors.push("Message cannot be empty.");

      if (errors.length > 0) {
        event.preventDefault();
        contactError.innerHTML = errors.map(e => `<p class='text-danger'>${e}</p>`).join("");
      }
    });
  }

  // ========== NEWSLETTER FORM ==========
  const newsletterForm = document.querySelector("#newsletterForm");
  const newsletterEmail = document.querySelector("#newsletterEmail");
  const newsletterError = document.querySelector("#newsletterError");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let emailValue = newsletterEmail.value.trim();

      if (!emailValue.includes("@") || !emailValue.includes(".")) {
        newsletterError.innerHTML = "<p class='text-danger'>Please enter a valid email address.</p>";
        return;
      }

      newsletterError.innerHTML = "<p class='text-success'>🎉 You're subscribed to our newsletter!</p>";
      newsletterEmail.value = "";
    });
  }

  // ========== USER NAVBAR STATUS ==========
  const userStatus = document.getElementById("userStatus");
  if (userStatus) {
    fetch('/current-user')
      .then(res => res.json())
      .then(data => {
        if (data.email) {
          userStatus.innerHTML = `
            <span class="me-2">Welcome, <strong>${data.email}</strong></span>
            <a href="/logout" class="btn btn-outline-dark btn-sm">Logout</a>
          `;
        } else {
          userStatus.innerHTML = `
            <a href="/login.html" class="btn btn-light">Login</a>
            <a href="/signup.html" class="btn btn-light">Sign Up</a>
          `;
        }
      });
  }

  // ========== SCROLL FADE-IN ==========
  const fadeInElements = document.querySelectorAll(".fade-on-scroll");

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeInElements.forEach(el => {
    scrollObserver.observe(el);
  });

  // ========== SEARCH FEATURE ==========
  const searchForm = document.querySelector("#searchForm");
  const searchInput = document.querySelector("#searchInput");
  const resultDiv = document.querySelector("#resultArea");

  if (searchForm && searchInput && resultDiv) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const keyword = searchInput.value;

      fetch(`/search?keyword=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(data => {
          if (data.length === 0) {
            resultDiv.innerHTML = `<p class="text-muted">No tours found for "<strong>${keyword}</strong>"</p>`;
            return;
          }

          resultDiv.innerHTML = data.map(t => `
            <div class="col-md-4">
              <div class="card h-100 shadow-sm">
                <img src="Picture/${t.image}" class="card-img-top" alt="${t.title}">
                <div class="card-body">
                  <h5 class="card-title">${t.title}</h5>
                  <p class="card-text">${t.destination} · ${t.duration} · ${t.price}</p>
                </div>
              </div>
            </div>
          `).join("");
        })
        .catch(err => {
          resultDiv.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
        });
    });
  }

  // ========== FOUR SEASONS AUTO-CYCLE ==========
  const categoryData = [
    {
      image: "Picture/Spring.jpg",
      title: "Spring in Jinhae",
      desc: "Witness the breathtaking beauty as cherry blossoms blanket the charming streets of Jinhae."
    },
    {
      image: "Picture/Summer.jpg",
      title: "Summer at Haeundae Beach",
      desc: "Feel the energy of Korea’s most famous beach and vibrant summer festivals."
    },
    {
      image: "Picture/Autumn.jpg",
      title: "Autumn in Naejangsan",
      desc: "Explore vivid foliage and crisp mountain air in Korea’s stunning autumn landscapes."
    },
    {
      image: "Picture/Winter.jpg",
      title: "Winter at Nami Island",
      desc: "Experience snowy magic, warm street food, and winter romance in iconic Nami Island."
    }
  ];

  let currentCategory = 1;
  const totalCategories = categoryData.length;

  function showCategory(n) {
    const item = categoryData[n - 1];
    document.getElementById("categoryImage").src = item.image;
    document.getElementById("categoryTitle").textContent = item.title;
    document.getElementById("categoryDesc").textContent = item.desc;
    currentCategory = n;

    const pageLinks = document.querySelectorAll(".page-link");
    pageLinks.forEach(btn => btn.classList.remove("active"));
    if (pageLinks[n - 1]) pageLinks[n - 1].classList.add("active");
  }

  window.showCategory = showCategory;

  function autoCycleCategory() {
    currentCategory = currentCategory % totalCategories + 1;
    showCategory(currentCategory);
  }

  setInterval(autoCycleCategory, 4000);

  // ========== FAVOURITE TOURS CAROUSEL FROM JSON ==========
  fetch("/top-tours")
    .then(res => res.json())
    .then(data => {
      console.log("Top Tours:", data);

      const container = document.getElementById("favouriteToursInner");
      if (!container || !Array.isArray(data) || data.length === 0) {
        console.warn("No data returned for top tours, skipping dynamic injection.");
        return;
      }

      const slides = data.map((tour, i) => {
        // fallback image if undefined
        const image = tour.image ? tour.image : 'default.jpg';
        return `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          <img src="Picture/${image}" class="d-block w-100" alt="${tour.title}">
          <div class="carousel-caption-box testimonials-container">
            <h6 class="fw-bold mb-1">${tour.title}</h6>
            <p class="text-muted small mb-0">
              ${tour.description || `${tour.destination} · ${tour.duration} · ${tour.price}`}
            </p>
          </div>
        </div>
      `;
      }).join("");

      // Inject slides
      container.innerHTML = slides;

      // Re-activate Bootstrap Carousel
      const carousel = bootstrap.Carousel.getOrCreateInstance(document.getElementById("favouriteToursCarousel"));
      carousel.cycle();
    })
    .catch(err => {
      console.error(" Error fetching /top-tours:", err);
    });
  // ========== SAVE TOUR BUTTON ==========
  function saveTour(title, destination, price, duration, image) {
    const savedTours = JSON.parse(localStorage.getItem("savedTours") || "[]");

    const exists = savedTours.some(t => t.title === title);
    if (exists) {
      alert(`You already saved "${title}".`);
      return;
    }

    savedTours.push({ title, destination, price, duration, image });
    localStorage.setItem("savedTours", JSON.stringify(savedTours));

    alert(`"${title}" has been saved to your list!`);
  }

  window.saveTour = saveTour;

  // ========== Chat Toggle with Sticker ==========
  const chatBtn = document.getElementById("chatToggle");
  const chatBox = document.getElementById("chatBox");
  const chatLabel = document.getElementById("chatLabel");

  chatBtn.addEventListener("mouseenter", () => {
    chatLabel.style.display = "block";
  });
  chatBtn.addEventListener("mouseleave", () => {
    chatLabel.style.display = "none";
  });

  chatBtn.addEventListener("click", () => {
    if (chatBox.style.display === "none") {
      chatBox.style.display = "block";
    } else {
      chatBox.style.display = "none";
    }
  });

  // ========== Send Message and Handle Chatbot ==========
  function sendMessage() {
    const msg = document.getElementById("messageInput").value;
    if (msg.trim()) {
      firebase.database().ref("messages").push({ text: msg });

      fetch("http://localhost:3001/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: msg })
      })
        .then(res => res.json())
        .then(data => {
          if (data.reply) {
            firebase.database().ref("messages").push({ text: `🤖 ${data.reply}` });
          }
        })
        .catch(err => {
          console.error("Chatbot fetch failed:", err);
        });

      document.getElementById("messageInput").value = "";
    }
  }

  // ========== Show Messages from Firebase ==========
  firebase.database().ref("messages").on("child_added", snapshot => {
    const msg = snapshot.val().text;
    const msgElem = document.createElement("div");
    msgElem.textContent = msg;
    document.getElementById("messages").appendChild(msgElem);
  });
});