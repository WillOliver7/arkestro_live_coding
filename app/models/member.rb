class Member < ApplicationRecord
  has_many :lendings, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  def returned_books
    self.lendings.where.not(return_date: nil).map(&:book)
  end

  def unreturned_books
    self.lendings.where(return_date: nil).map(&:book)
  end

  def ratings
    ratings = self.lendings.where.not(rating: nil).pluck(:rating)
    {
      max_rating: ratings.max,
      avg_rating: ratings.sum.to_f / ratings.size
    }
  end
end
