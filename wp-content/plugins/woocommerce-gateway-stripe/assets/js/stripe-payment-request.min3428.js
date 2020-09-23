jQuery(function(i){"use strict";var o,u=Stripe(wc_stripe_payment_request_params.stripe.key),p={getAjaxURL:function(t){return wc_stripe_payment_request_params.ajax_url.toString().replace("%%endpoint%%","wc_stripe_"+t)},getCartDetails:function(){var t={security:wc_stripe_payment_request_params.nonce.payment};i.ajax({type:"POST",data:t,url:p.getAjaxURL("get_cart_details"),success:function(t){p.startPaymentRequest(t)}})},getAttributes:function(){var t=i(".variations_form").find(".variations select"),a={},n=0,s=0;return t.each(function(){var t=i(this).data("attribute_name")||i(this).attr("name"),e=i(this).val()||"";0<e.length&&s++,n++,a[t]=e}),{count:n,chosenCount:s,data:a}},processSource:function(t,e){var a=p.getOrderData(t,e);return i.ajax({type:"POST",data:a,dataType:"json",url:p.getAjaxURL("create_order")})},getOrderData:function(t,e){var a=t.source,n=a.owner.email,s=a.owner.phone,r=a.owner.address,i=a.owner.name,o=t.shippingAddress,u={_wpnonce:wc_stripe_payment_request_params.nonce.checkout,billing_first_name:null!==i?i.split(" ").slice(0,1).join(" "):"",billing_last_name:null!==i?i.split(" ").slice(1).join(" "):"",billing_company:"",billing_email:null!==n?n:t.payerEmail,billing_phone:null!==s?s:t.payerPhone.replace("/[() -]/g",""),billing_country:null!==r?r.country:"",billing_address_1:null!==r?r.line1:"",billing_address_2:null!==r?r.line2:"",billing_city:null!==r?r.city:"",billing_state:null!==r?r.state:"",billing_postcode:null!==r?r.postal_code:"",shipping_first_name:"",shipping_last_name:"",shipping_company:"",shipping_country:"",shipping_address_1:"",shipping_address_2:"",shipping_city:"",shipping_state:"",shipping_postcode:"",shipping_method:[null===t.shippingOption?null:t.shippingOption.id],order_comments:"",payment_method:"stripe",ship_to_different_address:1,terms:1,stripe_source:a.id,payment_request_type:e};return o&&(u.shipping_first_name=o.recipient.split(" ").slice(0,1).join(" "),u.shipping_last_name=o.recipient.split(" ").slice(1).join(" "),u.shipping_company=o.organization,u.shipping_country=o.country,u.shipping_address_1=void 0===o.addressLine[0]?"":o.addressLine[0],u.shipping_address_2=void 0===o.addressLine[1]?"":o.addressLine[1],u.shipping_city=o.city,u.shipping_state=o.region,u.shipping_postcode=o.postalCode),u},getErrorMessageHTML:function(t){return i('<div class="woocommerce-error" />').text(t)},abortPayment:function(t,e){if(t.complete("fail"),i(".woocommerce-error").remove(),wc_stripe_payment_request_params.is_product_page){var a=i(".product");a.before(e),i("html, body").animate({scrollTop:a.prev(".woocommerce-error").offset().top},600)}else{var n=i(".shop_table.cart").closest("form");n.before(e),i("html, body").animate({scrollTop:n.prev(".woocommerce-error").offset().top},600)}},completePayment:function(t,e){p.block(),t.complete("success"),window.location=e},block:function(){i.blockUI({message:null,overlayCSS:{background:"#fff",opacity:.6}})},updateShippingOptions:function(t,e){var a={security:wc_stripe_payment_request_params.nonce.shipping,country:e.country,state:e.region,postcode:e.postalCode,city:e.city,address:void 0===e.addressLine[0]?"":e.addressLine[0],address_2:void 0===e.addressLine[1]?"":e.addressLine[1],payment_request_type:o,is_product_page:wc_stripe_payment_request_params.is_product_page};return i.ajax({type:"POST",data:a,url:p.getAjaxURL("get_shipping_options")})},updateShippingDetails:function(t,e){var a={security:wc_stripe_payment_request_params.nonce.update_shipping,shipping_method:[e.id],payment_request_type:o,is_product_page:wc_stripe_payment_request_params.is_product_page};return i.ajax({type:"POST",data:a,url:p.getAjaxURL("update_shipping_method")})},addToCart:function(){var t=i(".single_add_to_cart_button").val();i(".single_variation_wrap").length&&(t=i(".single_variation_wrap").find('input[name="product_id"]').val());var n={security:wc_stripe_payment_request_params.nonce.add_to_cart,product_id:t,qty:i(".quantity .qty").val(),attributes:i(".variations_form").length?p.getAttributes().data:[]},e=i("form.cart").serializeArray();return i.each(e,function(t,e){if(/^addon-/.test(e.name))if(/\[\]$/.test(e.name)){var a=e.name.substring(0,e.name.length-2);n[a]?n[a].push(e.value):n[a]=[e.value]}else n[e.name]=e.value}),i.ajax({type:"POST",data:n,url:p.getAjaxURL("add_to_cart")})},clearCart:function(){var t={security:wc_stripe_payment_request_params.nonce.clear_cart};return i.ajax({type:"POST",data:t,url:p.getAjaxURL("clear_cart"),success:function(t){}})},getRequestOptionsFromLocal:function(){return{total:wc_stripe_payment_request_params.product.total,currency:wc_stripe_payment_request_params.checkout.currency_code,country:wc_stripe_payment_request_params.checkout.country_code,requestPayerName:!0,requestPayerEmail:!0,requestPayerPhone:!0,requestShipping:wc_stripe_payment_request_params.product.requestShipping,displayItems:wc_stripe_payment_request_params.product.displayItems}},startPaymentRequest:function(t){var a,e;a=wc_stripe_payment_request_params.is_product_page?e=p.getRequestOptionsFromLocal():(e={total:t.order_data.total,currency:t.order_data.currency,country:t.order_data.country_code,requestPayerName:!0,requestPayerEmail:!0,requestPayerPhone:!0,requestShipping:!!t.shipping_required,displayItems:t.order_data.displayItems},t.order_data);var n=u.paymentRequest(e),s=u.elements({locale:wc_stripe_payment_request_params.button.locale}),r=p.createPaymentRequestButton(s,n);n.canMakePayment().then(function(t){t&&(o=t.applePay?"apple_pay":"payment_request_api",p.attachPaymentRequestButtonEventListeners(r,n),p.showPaymentRequestButton(r))}),n.on("shippingaddresschange",function(e){i.when(p.updateShippingOptions(a,e.shippingAddress)).then(function(t){e.updateWith({status:t.result,shippingOptions:t.shipping_options,total:t.total,displayItems:t.displayItems})})}),n.on("shippingoptionchange",function(e){i.when(p.updateShippingDetails(a,e.shippingOption)).then(function(t){"success"===t.result&&e.updateWith({status:"success",total:t.total,displayItems:t.displayItems}),"fail"===t.result&&e.updateWith({status:"fail"})})}),n.on("source",function(e){"no"===wc_stripe_payment_request_params.stripe.allow_prepaid_card&&"prepaid"===e.source.card.funding?p.abortPayment(e,p.getErrorMessageHTML(wc_stripe_payment_request_params.i18n.no_prepaid_card)):i.when(p.processSource(e,o)).then(function(t){"success"===t.result?p.completePayment(e,t.redirect):p.abortPayment(e,t.messages)})})},getSelectedProductData:function(){var t=i(".single_add_to_cart_button").val();i(".single_variation_wrap").length&&(t=i(".single_variation_wrap").find('input[name="product_id"]').val());var e=(i("#product-addons-total").data("price_data")||[]).reduce(function(t,e){return t+e.cost},0),a={security:wc_stripe_payment_request_params.nonce.get_selected_product_data,product_id:t,qty:i(".quantity .qty").val(),attributes:i(".variations_form").length?p.getAttributes().data:[],addon_value:e};return i.ajax({type:"POST",data:a,url:p.getAjaxURL("get_selected_product_data")})},debounce:function(n,s,r){var i;return function(){var t=this,e=arguments,a=r&&!i;clearTimeout(i),i=setTimeout(function(){i=null,r||s.apply(t,e)},n),a&&s.apply(t,e)}},createPaymentRequestButton:function(t,e){var a;if(wc_stripe_payment_request_params.button.is_custom&&(a=i(wc_stripe_payment_request_params.button.css_selector)).length)return a.data("isCustom",!0),a;if(wc_stripe_payment_request_params.button.is_branded){if(p.shouldUseGooglePayBrand())return(a=p.createGooglePayButton()).data("isBranded",!0),a;wc_stripe_payment_request_params.button.type="long"===wc_stripe_payment_request_params.button.branded_type?"buy":"default"}return t.create("paymentRequestButton",{paymentRequest:e,style:{paymentRequestButton:{type:wc_stripe_payment_request_params.button.type,theme:wc_stripe_payment_request_params.button.theme,height:wc_stripe_payment_request_params.button.height+"px"}}})},isCustomPaymentRequestButton:function(t){return t&&"function"==typeof t.data&&t.data("isCustom")},isBrandedPaymentRequestButton:function(t){return t&&"function"==typeof t.data&&t.data("isBranded")},shouldUseGooglePayBrand:function(){var t=window.navigator.userAgent.toLowerCase(),e=/chrome/.test(t)&&!/edge|edg|opr|brave\//.test(t)&&"Google Inc."===window.navigator.vendor,a=e&&window.navigator.brave;return e&&!a},createGooglePayButton:function(){var t=wc_stripe_payment_request_params.button.theme,e=wc_stripe_payment_request_params.button.branded_type,a=wc_stripe_payment_request_params.button.locale,n=wc_stripe_payment_request_params.button.height;t=["dark","light"].includes(t)?t:"light",e=["short","long"].includes(e)?e:"long";var s=i('<button type="button" id="wc-stripe-branded-button" aria-label="Google Pay" class="gpay-button"></button>');s.css("height",n+"px"),s.addClass(t+" "+e),"long"===e&&function(t,e,a){t.css("background-image","url("+e+")");var n=document.createElement("img");n.onerror=function(){t.css("background-image","url("+a+")")},n.src=e}(s,"https://www.gstatic.com/instantbuy/svg/"+t+"/"+a+".svg","https://www.gstatic.com/instantbuy/svg/"+t+"/en.svg");return s},attachPaymentRequestButtonEventListeners:function(t,e){wc_stripe_payment_request_params.is_product_page?p.attachProductPageEventListeners(t,e):p.attachCartPageEventListeners(t,e)},attachProductPageEventListeners:function(e,a){var n=[],s=i(".single_add_to_cart_button");e.on("click",function(t){return s.is(".disabled")?(t.preventDefault(),void(s.is(".wc-variation-is-unavailable")?window.alert(wc_add_to_cart_variation_params.i18n_unavailable_text):s.is(".wc-variation-selection-needed")&&window.alert(wc_add_to_cart_variation_params.i18n_make_a_selection_text))):0<n.length?(t.preventDefault(),void window.alert(n)):(p.addToCart(),void((p.isCustomPaymentRequestButton(e)||p.isBrandedPaymentRequestButton(e))&&(t.preventDefault(),a.show())))}),i(document.body).on("woocommerce_variation_has_changed",function(){p.blockPaymentRequestButton(e),i.when(p.getSelectedProductData()).then(function(t){i.when(a.update({total:t.total,displayItems:t.displayItems})).then(function(){p.unblockPaymentRequestButton(e)})})}),i(".quantity").on("input",".qty",function(){p.blockPaymentRequestButton(e)}),i(".quantity").on("input",".qty",p.debounce(250,function(){p.blockPaymentRequestButton(e),n=[],i.when(p.getSelectedProductData()).then(function(t){t.error?(n=[t.error],p.unblockPaymentRequestButton(e)):i.when(a.update({total:t.total,displayItems:t.displayItems})).then(function(){p.unblockPaymentRequestButton(e)})})}))},attachCartPageEventListeners:function(t,e){(wc_stripe_payment_request_params.button.is_custom&&p.isCustomPaymentRequestButton(t)||wc_stripe_payment_request_params.button.is_branded&&p.isBrandedPaymentRequestButton(t))&&t.on("click",function(t){t.preventDefault(),e.show()})},showPaymentRequestButton:function(t){p.isCustomPaymentRequestButton(t)?(t.addClass("is-active"),i("#wc-stripe-payment-request-wrapper, #wc-stripe-payment-request-button-separator").show()):p.isBrandedPaymentRequestButton(t)?(i("#wc-stripe-payment-request-wrapper, #wc-stripe-payment-request-button-separator").show(),i("#wc-stripe-payment-request-button").html(t)):i("#wc-stripe-payment-request-button").length&&(i("#wc-stripe-payment-request-wrapper, #wc-stripe-payment-request-button-separator").show(),t.mount("#wc-stripe-payment-request-button"))},blockPaymentRequestButton:function(t){i("#wc-stripe-payment-request-button").data("blockUI.isBlocked")||(i("#wc-stripe-payment-request-button").block({message:null}),p.isCustomPaymentRequestButton(t)&&t.addClass("is-blocked"))},unblockPaymentRequestButton:function(t){i("#wc-stripe-payment-request-button").unblock(),p.isCustomPaymentRequestButton(t)&&t.removeClass("is-blocked")},init:function(){wc_stripe_payment_request_params.is_product_page?p.startPaymentRequest(""):p.getCartDetails()}};p.init(),i(document.body).on("updated_cart_totals",function(){p.init()}),i(document.body).on("updated_checkout",function(){p.init()})});