require 'pp'

module Tracer
  class Flow
    class ExecutionTracker
      attr_reader :trace_history, :trace_point
      attr_accessor :execution_depth

      def initialize
        @trace_history = []
        @execution_depth = 1

        @trace_point = TracePoint.new(:return) do |point|
          # See Kernel#caller
          #
          # caller(0,1) will be the line refering to this block of code
          #
          # caller(1,1) will be the line refering to the method that was called
          # or the method that is returning something
          #
          # caller(2,1) will be the line refering to the method that has called
          # the method called (aka caller(1,1)), or the method that has called
          # the method that is returning something (aka caller(1,1)).
          #
          handle(point, caller(2, 1).first)
          if ponint.path =~ %r{/var/www/hosting-services/app/controllers/sites/domains_controller.rb}
            trace_history << {
              event: point.event,
              class: point.defined_class.to_s,
              method: point.method_id,
              path: point.path,
              path_lineno: point.lineno,
              # We are using inspect here to avoid performance issues
              return: point.return_value.pretty_inspect
            }
          end
        end
      end

      private

      attr_writer :trace_history

      def method_called_from_inside_the_project?(who_called_the_called_method)
        !who_called_the_called_method.match %r{/lib/ruby/}
      end

      def returning_execution_to_project?(who_called_the_method_being_returned)
        !who_called_the_method_being_returned.match %r{/lib/ruby/}
      end

      # We are using inspect here to avoid performance issues
      def params(point_binding)
        point_binding.eval('local_variables').map do |variable|
          [variable, point_binding.eval(variable.to_s)]
        end.to_h.pretty_inspect
      end
    end
  end
end

