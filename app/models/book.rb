class Book < ApplicationRecord
  has_many :lendings, dependent: :destroy
end
