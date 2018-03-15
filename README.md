# Tracer

Generate dependency diagrams

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'tracer'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install tracer

## Usage

```ruby
Tracer::Flow.trace do
  # Code to trace here
end
```

After execution a file named `tracer/trace.json` will be created with a JSON containing information about the execution.

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/gabrielgiordano/tracer.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
