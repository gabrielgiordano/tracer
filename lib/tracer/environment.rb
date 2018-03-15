module Tracer
  class Environment
    def self.boot
      Dir.mkdir('tracer') unless Dir.exists?('tracer')
    end
  end
end
