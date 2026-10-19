class LendingsController < ApplicationController
  before_action :set_lending, only: %i[ show update destroy ]

  # GET /lendings
  def index
    @lendings = Lending.all

    render json: @lendings
  end

  # GET /lendings/1
  def show
    render json: @lending
  end

  # POST /lendings
  def create
    @lending = Lending.new(lending_params)

    if @lending.save
      render json: @lending, status: :created, location: @lending
    else
      render json: @lending.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /lendings/1
  def update
    if @lending.update(lending_params)
      render json: @lending
    else
      render json: @lending.errors, status: :unprocessable_content
    end
  end

  # DELETE /lendings/1
  def destroy
    @lending.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_lending
      @lending = Lending.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def lending_params
      params.expect(lending: [ :rating, :return_date, :is_late, :user, :references, :book_id ])
    end
end
