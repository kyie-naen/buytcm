async function getNewCart() {
    //get new cart
    const res = await fetch("/cart.json");
    const cart = await res.json();

    //update cart icon
    document.querySelectorAll('.cart-count').forEach((el) => {
        el.textContent = cart.item_count;
    })
}

// Ambil parameter 'tags' dari URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fungsi untuk mendapatkan parameter dari URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Ambil nilai dari parameter 'tags'
const tagsValue = getQueryParam("tags");

// Simpan di localStorage jika nilai tersedia
if (tagsValue) {
    localStorage.setItem("tags", tagsValue);
    console.log("Tags saved to localStorage:", tagsValue);
} else {
    console.log("No 'tags' parameter found in URL.");
}


function copyToClipboard() {
    const text = document.getElementById("tcmCode").getAttribute("value"); // Ambil value dari atribut
    navigator.clipboard.writeText(text).then(() => {
        alert("Code copied successfully: " + text); // Notifikasi sukses
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const tagsValue = getQueryParam("tags");
    const ls = localStorage.getItem("tags");
    if (tagsValue) {
        console.log(tagsValue);  
        const inputField = document.querySelector('input[name="customer[tags]"]');
        if (inputField) {
          inputField.value = tagsValue; // Masukkan nilai ke dalam input
        }
    } else if (ls) {
        console.log(ls);  
        const inputField = document.querySelector('input[name="customer[tags]"]');
        if (inputField) {
          inputField.value = ls; // Masukkan nilai ke dalam input
        }
    }


    if (typeof jQuery !== "undefined") {
        $(document).ready(function() {
          console.log("jQuery document ready with jQuery.noConflict()!");

          $('[data-toggle="modal"]').click(function() {
            var target = $(this).attr("data-target");
            $(target).modal("show");
          });

          $('.slider1').slick({
                autoplay: true,
                autoplaySpeed: 2500,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                    {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                    }
                ]
            });
        
            $('.slider-for').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                asNavFor: '.slider-nav',
                adaptiveHeight: true,
                autoplay: true,
                autoplaySpeed: 2000
            });
            
            $('.slider-nav').slick({
                slidesToShow: 5,
                slidesToScroll: 1,
                asNavFor: '.slider-for',
                dots: false,
                arrows: false,
                centerMode: false,
                focusOnSelect: true,
                infinite: false,
                useTransform: false
            });
            // $('.slider-for').find('.slick-arrow').text(' ');
            
            $('.slider-for').on( 'afterChange', function(){
                $('.slider-nav').find('.item').removeClass('active');
                var a = false;
                $('.slider-nav').find('.item').each(function(k,v){
                    if(!a){
                    $(this).addClass('active');
                    }
                if( $(this).hasClass('slick-current') ){
                    a = true;
                }
                });
            });

            $('.input-cart button').click(function(e){
                e.preventDefault();
                
                fieldName = $(this).attr('data-field');
                type      = $(this).attr('data-type');
                var input = $(this).closest('.input-cart').find("input[name='"+fieldName+"']");
                var currentVal = parseInt(input.val());
        
                if (!isNaN(currentVal)) {
                    if(type == 'minus') {
                        
                        if(currentVal > input.attr('min')) {
                            input.val(currentVal - 1).change();
                        } 
                        if(parseInt(input.val()) == input.attr('min')) {
                            $(this).attr('disabled', true);
                        }
        
                    } else if(type == 'plus') {
        
                        if(currentVal < input.attr('max')) {
                            input.val(currentVal + 1).change();
                        }
                        if(parseInt(input.val()) == input.attr('max')) {
                            $(this).attr('disabled', true);
                        }
        
                    }
                } else {
                    input.val(0);
                }
                
            })
        
            $('.input-cart input[type=number]').focusin(function(){
                $(this).data('oldValue', $(this).val());
            });
        
            $('.input-cart input[type=number]').change(function() {
            
                minValue =  parseInt($(this).attr('min'));
                maxValue =  parseInt($(this).attr('max'));
                valueCurrent = parseInt($(this).val());
                
                name = $(this).attr('name');
                if(valueCurrent >= minValue) {
                    $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
                } else {
                    alert('Sorry, the minimum value was reached');
                    $(this).val($(this).data('oldValue'));
                }
                if(valueCurrent <= maxValue) {
                    $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
                } else {
                    alert('Sorry, the maximum value was reached');
                    $(this).val($(this).data('oldValue'));
                }
            });
        
            $(document).on('click', '.input-cart-offcanvas button', async function(e) {
                e.preventDefault();
        
                console.log(e);
                
            
                let fieldName = $(this).attr('data-field');
                let type = $(this).attr('data-type');
                
                let input = $(this).closest('.input-cart-offcanvas').find("input[name='"+fieldName+"']");
                let currentVal = parseInt(input.val());
                let minValue = parseInt(input.attr('min'));
                let maxValue = parseInt(input.attr('max'));
                let hasil = 0;
            
                // Mendapatkan key
                const key = $(this).closest('.cart-drawer').find('input[type=hidden]').val();
                
                if (type === 'minus') {
                    hasil = currentVal - 1;
                    if (hasil >= minValue) {
                        input.val(hasil);
                        await updateCart(key, hasil);
                    }
                } else {
                    hasil = currentVal + 1;
                    if (hasil <= maxValue) {
                        input.val(hasil);
                        await updateCart(key, hasil);
                    }
                }
            
                getNewCart();
                await updateOffCanvas();
                // await updateCartPage();
            });

            $(".select-variant").on("change", function () {
                var newVariantId = $(this).val(); // Ambil variant ID baru
                var quantity = $(this).find(":selected").data("qty"); // Ambil quantity saat ini
                var newKey = $(this).find(":selected").data("key"); // Ambil quantity saat ini
        
                // Panggil `changeVariant` tanpa "line"
                changeVariant(newKey, newVariantId, quantity);
            });
          
            var btn = $('#back-to-top');

            $(window).scroll(function() {
                if ($(window).scrollTop() > 300) {
                    btn.addClass('show');
                } else {
                    btn.removeClass('show');
                }
            });

            btn.on('click', function(e) {
                e.preventDefault();
                $('html, body').animate({scrollTop:0}, '300');
            });
        });
      }
});
const basePath = window.location.pathname.startsWith('/zh') ? '/zh' : '/';


async function updateOffCanvas() {
    const res = await fetch(`${basePath}?section_id=off-canvas`);

    const text = await res.text();
    const html = document.createElement("div");
    html.innerHTML = text
    
    const newBox = html.querySelector('.offcanvas-cart').innerHTML;
    document.querySelector('.offcanvas-cart').innerHTML = newBox;
}

async function updateCartPage() {
    const res = await fetch(`${basePath}?section_id=main-cart`);

    const text = await res.text();
    const html = document.createElement("div");
    html.innerHTML = text
    
    const newBox = html.querySelector('.container-cart').innerHTML;
    document.querySelector('.container-cart').innerHTML = newBox;
}

//update data drawer

async function updateCart(key, quantity) {
    const buttons = document.querySelectorAll("button"); // Ambil semua tombol

    try {
        // Disable semua tombol sebelum API call
        buttons.forEach(btn => btn.disabled = true);

        const res = await fetch("/cart/update.js", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates: { [key]: quantity } }),
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error updating cart:", error);
    } finally {
        // Enable semua tombol setelah API call selesai
        buttons.forEach(btn => btn.disabled = false);
    }
}


function changeVariant(newKey, newVariantId, newQuantity) {
    var buttons = $("button"); // Ambil semua tombol

    // Disable semua tombol sebelum request
    buttons.prop("disabled", true);

    //50705564664124
    let a = parseInt(newVariantId)
    console.log(typeof a);
    

    $.ajax({
        type: "POST",
        url: "/cart/change.js",
        data: JSON.stringify({
            id: a, // Pastikan variant ID adalah integer
            quantity: newQuantity, // Pastikan quantity juga integer
        }),
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            console.log("Cart updated:", response);

            // Bisa tambahkan fungsi refresh cart atau reload halaman
            location.reload();
        },
        error: function(xhr, status, error) {
            console.error("Error changing variant:", error);
        },
        complete: function() {
            // Enable kembali tombol setelah request selesai
            buttons.prop("disabled", false);
        }
    });
}



getNewCart();
// updateCartPage();

const toastAddtoCart = document.getElementById('liveAddToCart')
var myOffcanvas = document.getElementById('offcanvasExample')


document.body.addEventListener('submit', async (event) => {
    const form = event.target.closest('form[action$="/cart/add"]');
    if (form) {
      event.preventDefault(); // Cegah submit default jika diperlukan
        var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
        event.preventDefault();

        await fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            body: new FormData(form)
          })
          .then(async response => {
            await updateOffCanvas() 
            bsOffcanvas.show()
          })
          .catch((error) => {
            console.error('Error:', error);
          });

        getNewCart();
    }
}); 

// var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
//     keyboard: false
// })

// myModal.show()


// async function getDataModal(handle) {
//     let slug = handle.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-'); 
    
//     const res = await fetch(`${basePath}/products/${slug}`)
//     const text = await res.text();
//     const html = document.createElement("div");
//     html.innerHTML = text
//     const newBox = html.querySelector('.product-card').innerHTML;
    
//     document.querySelector('.modal-body').innerHTML = newBox;
// }