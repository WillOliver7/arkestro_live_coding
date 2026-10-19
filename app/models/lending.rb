class Lending < ApplicationRecord
  belongs_to :book
  belongs_to :member

  after_create :set_due_date
  after_create :set_book_as_lent
  after_update :sync_book_lent_status, if: :saved_change_to_return_date?

  private

  def set_due_date
    update_column(:due_date, Date.current + 14.days)
  end

  def set_book_as_lent
    book.update_column(:is_lent, true)
  end

  def sync_book_lent_status
    book.update_column(:is_lent, return_date.nil?)
  end
end
