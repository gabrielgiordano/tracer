require 'json'
require 'tracer/environment'
require 'tracer/execution_tracker'

module Tracer
  class Flow
    class << self
      def trace
        Tracer::Environment.boot

        tracker = ExecutionTracker.new

        tracker.trace_point.enable
        yield
        tracker.trace_point.disable

        File.open('tracer/trace.json', 'w') do |f|
          f.write JSON.generate(tracker.trace_history)
        end
      end
    end
  end
end

