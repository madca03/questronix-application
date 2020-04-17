$(function() {
    console.log("ready");

    $(document).on("click", "button.delete", delete_button_clicked);
    $(document).on("click", "button.edit", edit_button_clicked);
    $(document).on("click", "button.save", save_button_clicked);
    $(document).on("click", "button.cancel", cancel_button_clicked);
});

// let item = {};
// item['has_selected'] = false;

function replace_form_fields_with_static_data(current_item) {
  $(current_item).parents().each(function() {
    if ($(this).prop("tagName") === "TR") {
      let current_table_row = this;

      $(current_table_row).children().each(function() {
        let table_td = this;
        let span_tag = $(table_td).children("span");
        let input_tag = $(table_td).children("input");

        if ($(table_td).hasClass("item-name") || $(table_td).hasClass("item-qty") || $(table_td).hasClass("item-amount")) {
          $(span_tag).show();
          $(input_tag).remove();
        }
      })
    }
  })
}

function delete_button_clicked() {
  let item_id = $(this).data("item-id");

  $(this).parents().each( function() {
    if ($(this).prop("tagName") === "TR") {
      let table_row = this;
      $(table_row).remove();
    }
  });

  $.ajax({
      url: `http://localhost:3000/api/article/${item_id}`,
      method: 'DELETE'
    })
    .done((res) => {
      // for debug
      console.log(res);
    });
}

function cancel_button_clicked() {
  $("button.edit").each(function() {
    $(this).prop("disabled", false);
    $(this).removeClass("btn-secondary").addClass("btn-warning");
  });

  $("button.delete").each(function() {
    $(this).prop("disabled", false);
    $(this).removeClass("btn-secondary").addClass("btn-danger");
  });

  // replace cancel button with the edit button
  let old_cancel_button = this;
  $(old_cancel_button).prop("innerHTML", "Edit");
  $(old_cancel_button).removeClass("btn-danger").addClass("btn-warning");
  $(old_cancel_button).removeClass("cancel").addClass("edit");

  $("button.save").remove();

  replace_form_fields_with_static_data(this);
}

function update_item(current_item) {
  let new_item = {}
  let item_id = $(current_item).data("item-id");

  $(current_item).parents().each(function() {
    if ($(this).prop("tagName") === "TR") {
      let table_row = this;
      $(table_row).children().each(function() {
        let table_td = this;
        let input_tag = $(table_td).children("input");
        
        if ($(table_td).hasClass("item-name")) {
          new_item['name'] = $(input_tag).val();
        }
        else if ($(table_td).hasClass("item-qty")) {
          new_item['qty'] = $(input_tag).val();
        }
        else if ($(table_td).hasClass("item-amount")) {
          new_item['amount'] = $(input_tag).val();
        }
      });
    }
  })

  $.ajax({
    url: `http://localhost:3000/api/article/${item_id}`,
    method: 'PUT',
    data: new_item,
    dataType: 'json',
  })
  .done((res) => {
    // for debug
    console.log(res);
  });

  console.log(new_item);
  console.log("item id = " + item_id);
}

function save_button_clicked() {
  $("button.edit").each(function() {
    $(this).prop("disabled", false);
    $(this).removeClass("btn-secondary").addClass("btn-warning");
  });

  $("button.delete").each(function() {
    $(this).prop("disabled", false);
    $(this).removeClass("btn-secondary").addClass("btn-danger");
  });

  // replace save button with the edit button
  let old_save_button = this;
  $(old_save_button).prop("innerHTML", "Edit");
  $(old_save_button).removeClass("btn-success").addClass("btn-warning");
  $(old_save_button).removeClass("save").addClass("edit");

  $("button.cancel").remove();

  update_item(this);
  replace_form_fields_with_static_data(this);
}

function edit_button_clicked() {
  $("button.delete").each(function() {
    $(this).prop("disabled", true);
    $(this).removeClass("btn-danger").addClass("btn-secondary");
  });

  let current_item = this;
  
  $(current_item).parents().each(function() {
    if ($(this).prop("tagName") === "TR") {
      let current_table_row = this;

      $(current_table_row).children().each(function() {
        let table_td = this;
        let span_tag = $(table_td).children("span");

        if ($(table_td).hasClass("item-name")) {
          let item_name = $(span_tag).prop("innerHTML");
          $(span_tag).hide();
          $(table_td).append(`<input class="form-control" id="edit-item-name" value="${item_name}">`);
        } 
        else if ($(table_td).hasClass("item-qty")) {
          let item_qty = $(span_tag).prop("innerHTML");
          $(span_tag).hide();
          $(table_td).append(`<input class="form-control" id="edit-item-qty" value="${item_qty}">`);
        } 
        else if ($(table_td).hasClass("item-amount")) {
          let item_amount = $(span_tag).prop("innerHTML");
          $(span_tag).hide();
          $(table_td).append(`<input class="form-control" id="edit-item-amount" value="${item_amount}">`);
        }
      });
    }
  });
  
  $("button.edit").each(function() {
    if (this != current_item) {
      $(this).prop("disabled", true);
      $(this).removeClass("btn-warning").addClass("btn-secondary");
    } else {
      let button_parent = $(this).parent();
      
      let new_cancel_button = $(this).clone();
      $(new_cancel_button).prop("innerHTML", "Cancel");
      $(new_cancel_button).removeClass("btn-warning").addClass("btn-danger");
      $(new_cancel_button).removeClass("edit").addClass("cancel");
      
      let new_save_button = $(this).clone();
      $(new_save_button).prop("innerHTML", "Save");
      $(new_save_button).removeClass("btn-warning").addClass("btn-success");
      $(new_save_button).removeClass("edit").addClass("save");
      
      $(this).remove();
      $(button_parent).append(new_save_button);
      $(button_parent).append(new_cancel_button);
    }
  });
}