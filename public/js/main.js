$(function() {
    // console.log("ready");

    $(document).on("click", "button.delete", delete_button_clicked);
    $(document).on("click", "button.edit", edit_button_clicked);
    $(document).on("click", "button.save", save_button_clicked);
    $(document).on("click", "button.cancel", cancel_button_clicked);
    $(document).on("submit", "form.newItem", submit_button_new_item_handler);
    
});

function add_item_to_server(new_item) {
  $.ajax({
    url: `http://localhost:3000/api/article`,
    method: 'POST',
    data: new_item,
    dataType: 'json',
  })
  .done((res) => {
    // for debug
    console.log(res);
    new_item['id'] = res['results']['insertId'];
    add_new_item_row(new_item);
  });
}

function add_new_item_row(new_item) {
  // // debug
  // console.log(new_item);
  // console.log($("td.item-name").length);

  let table_row = `
      <tr>
        <td class="item-name"><span></span></td>
        <td class="item-qty"><span></span></td>
        <td class="item-amount"><span></span></td>
        <td class="item-edit" width="15%"><button type="button" class="btn btn-warning edit" data-item-id="1">Edit</button></td>
        <td class="item-delete"><button type="button" class="btn btn-danger delete" data-item-id="1">Delete</button></td>
      </tr>
    `;

  table_row = $.parseHTML(table_row);

  $(table_row).children().each(function() {
    if ($(this).hasClass("item-name")) {
      $(this).children('span').prop("innerHTML", new_item['name']);
    }
    else if ($(this).hasClass("item-qty")) {
      $(this).children("span").prop("innerHTML", new_item['qty']);
    }
    else if ($(this).hasClass("item-amount")) {
      $(this).children("span").prop("innerHTML", new_item["amount"]);
    }
    else if ($(this).hasClass("item-edit")) {
      $(this).children("button").attr("data-item-id", new_item['id']);
    }
    else if ($(this).hasClass("item-delete")) {
      $(this).children("button").attr("data-item-id", new_item['id']);
    }
  });

  $(".table > tbody").append($(table_row));
}

function submit_button_new_item_handler(e) {
  e.preventDefault();
      
  let form_valid = true;
  let new_item = {}
  let item_form = this;

  $(item_form).find("input").each(function() {
    let input_tag = this;

    if (input_tag.checkValidity() === false) {
      form_valid = false;
      if ($(input_tag).hasClass('is-valid')) {
        $(input_tag).removeClass('is-valid');
      }
      $(input_tag).addClass("is-invalid");
    } else {
      if ($(input_tag).hasClass('is-invalid')) {
        $(input_tag).removeClass('is-invalid');
      }
      $(input_tag).addClass("is-valid");
    }

    if (form_valid) {
      if ($(input_tag).attr('id') === "newItemName") {
        new_item['name'] = $(input_tag).val();
      }
      else if ($(input_tag).attr('id') === "newItemQty") {
        new_item['qty'] = $(input_tag).val();
      }
      else if ($(input_tag).attr('id') === "newItemAmount") {
        new_item['amount'] = $(input_tag).val();
      }
    }
  });

  if (form_valid) {
    // remove modal if form is valid
    $(".modal").modal('toggle');
    add_item_to_server(new_item);
  }

}

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

function replace_form_fields_with_updated_static_data(current_item, new_item_fields) {
  $(current_item).parents().each(function() {
    if ($(this).prop("tagName") === "TR") {
      let current_table_row = this;

      $(current_table_row).children().each(function() {
        let table_td = this;
        let span_tag = $(table_td).children("span");
        let input_tag = $(table_td).children("input");

        if ($(table_td).hasClass("item-name")) {
          $(input_tag).remove();
          $(span_tag).prop("innerHTML", new_item_fields['name']);
          $(span_tag).show();
        }
        else if ($(table_td).hasClass("item-qty")) {
          $(input_tag).remove();
          $(span_tag).prop("innerHTML", new_item_fields['qty']);
          $(span_tag).show();
        }
        else if ($(table_td).hasClass("item-amount")) {
          $(input_tag).remove();
          $(span_tag).prop("innerHTML", new_item_fields['amount']);
          $(span_tag).show();
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

  // remove invalid-feedbacks divs when cancelling edit
  $(this).parent().siblings().each(function() {
    $(this).children("div.invalid-feedback").remove();
  });

  replace_form_fields_with_static_data(this);
}

function update_item(current_item) {
  // current item is the clicked save button
  let new_item = {}
  let form_valid_arr = [];
  let item_id = $(current_item).data("item-id");
  let form_valid = true;

  $(current_item).parents().each(function() {
    if ($(this).prop("tagName") === "TR") {
      let table_row = this;
      $(table_row).children().each(function() {
        let table_td = this;
        let input_tag = $(table_td).children("input");
        
        if ($(table_td).hasClass("item-name") || $(table_td).hasClass("item-qty") || $(table_td).hasClass("item-amount")) {
          if ($(input_tag).get(0).checkValidity() === false) {
            if ($(input_tag).hasClass('is-valid')) {
              $(input_tag).removeClass('is-valid');
            }
            $(input_tag).addClass('is-invalid');
            form_valid_arr.push(false);
          } else {
            if ($(input_tag).hasClass('is-invalid')) {
              $(input_tag).removeClass('is-invalid');
            }
            $(input_tag).addClass('is-valid');
            form_valid_arr.push(true);
          }
        }

        for (i of form_valid_arr) {
          if (!i) {
            form_valid = false;
            break;
          }
        }
    
        if (form_valid) {
          if ($(table_td).hasClass("item-name")) {
            new_item['name'] = $(input_tag).val();
          }
          else if ($(table_td).hasClass("item-qty")) {
            new_item['qty'] = $(input_tag).val();
          }
          else if ($(table_td).hasClass("item-amount")) {
            new_item['amount'] = $(input_tag).val();
          }
        }
      });
    }
  })

  if (form_valid) {
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
  }

  return [new_item, form_valid];
}

function save_button_clicked() {
  let [new_item_fields, form_valid] = update_item(this);
  if (form_valid) {
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

    replace_form_fields_with_updated_static_data(this, new_item_fields);
  }
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
          let item_name_field = $.parseHTML(`
            <input type="text" class="form-control" id="edit-item-name" value="${item_name}" required>
            <div class="invalid-feedback">
              Invalid name input
            </div>
          `);
          $(span_tag).hide();
          $(table_td).append($(item_name_field));
        } 
        else if ($(table_td).hasClass("item-qty")) {
          let item_qty = $(span_tag).prop("innerHTML");
          let item_qty_field = $.parseHTML(`
            <input type="number" min="0" step="1" class="form-control" id="edit-item-qty" value="${item_qty}" required>
            <div class="invalid-feedback">
              Invalid quantity input
            </div>
          `);

          $(span_tag).hide();
          $(table_td).append($(item_qty_field));
        } 
        else if ($(table_td).hasClass("item-amount")) {
          let item_amount = $(span_tag).prop("innerHTML");
          let item_amount_field = $.parseHTML(`
            <input type="number" min="0" step="any" class="form-control" id="edit-item-qty" value="${item_amount}" required>
            <div class="invalid-feedback">
              Invalid amount input
            </div>
          `);

          $(span_tag).hide();
          $(table_td).append($(item_amount_field));
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