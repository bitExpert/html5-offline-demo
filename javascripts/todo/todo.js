/*
 * Copyright (c) 2007-2012 bitExpert AG
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */


;(function ($, window, undefined) {
	'use strict';

	var settings = {
		init: false,
		store: null
	},

	methods = {
		init: function (opts) {
			return this.each(function(idx, elem) {
				if(!settings.init)
				{
					// set-up store
					settings.store = WebStorage(function(item) {
						methods.renderTodoItem(elem, item);
					}),

					// add events
					methods.events(elem);

					// mark as being initialized
					settings.init = true;
				}

				// render existing todo items
				methods.updateTodolist(elem);
			});
		},
		events: function(elem) {
			// bind form submit button
			$('form input.button', elem).click(function(e) {
				e.preventDefault();
				e.stopPropagation();

				var item = methods.getInputFrom($(this).parent());

				methods.storeTodoItem(item);
				methods.updateTodolist();

				return false;
			});

			// bind todo item delete button
			$('table td.delete a', elem).live('click', function(e) {
				var id = $(this).data('id');

				methods.deleteTodoItem(id);
				methods.updateTodolist(elem);
				return false;
			});
		},
		getInputFrom: function(form) {
			return {
				id:   $('input[name="id"]', form).val(),
				todo: $('input[name="todo"]', form).val()
			};
		},
		storeTodoItem: function(item) {
			settings.store.add(item);
		},
		deleteTodoItem: function(id) {
			settings.store.remove(id);
		},
		updateTodolist: function(elem) {
			methods.clearTodolist(elem);
			settings.store.read();
		},
		clearTodolist: function(elem) {
			$('table', elem).html('');
		},
		renderTodoItem: function(elem, item) {
			$('table', elem).append('<tr><td>'+item.todo+'</td><td class="delete"><a class="secondary button" data-id='+item.id+' href="#">X</a></td></tr>');
		}
	};

	$.fn.todo = function (method) {
		if (methods[method])
		{
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if (typeof method === 'object' || !method)
		{
			return methods.init.apply(this, arguments);
		}
		else
		{
			$.error('Method ' +  method + ' does not exist on jQuery.todo');
		}
	};
})(jQuery, this);