class AddDueDateToLendings < ActiveRecord::Migration[8.0]
  def change
    add_column :lendings, :due_date, :date
  end
end
