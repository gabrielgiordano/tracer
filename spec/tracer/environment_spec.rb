require 'tracer/environment'

RSpec.describe Tracer::Environment, type: :aruba do
  describe '.boot' do
    subject(:boot) { cd('.') { described_class.boot } }

    it "creates a 'tracer' folder to store the output" do
      boot
      expect(directory?('tracer')).to be true
    end

    it 'checks if folder already exists' do
      create_directory('tracer')
      boot
      expect(directory?('tracer')).to be true
    end
  end
end

