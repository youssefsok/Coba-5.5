jQuery(document).ready(function(a){jQuery(document).on("click",".wcml_removed_cart_items_clear",function(a){a.preventDefault(),jQuery.ajax({type:"post",url:woocommerce_params.ajax_url,data:{action:"wcml_cart_clear_removed_items",wcml_nonce:jQuery("#wcml_clear_removed_items_nonce").val()},success:function(a){window.location=window.location.href}})})});