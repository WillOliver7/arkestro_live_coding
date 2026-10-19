class CreateLendings < ActiveRecord::Migration[8.0]
  def change
    create_table :lendings do |t|
      t.integer :rating
      t.date :return_date
      t.boolean :is_late

      t.references :member, null: false, foreign_key: true
      t.references :book, null: false, foreign_key: true

      t.timestamps
    end
  end
end
