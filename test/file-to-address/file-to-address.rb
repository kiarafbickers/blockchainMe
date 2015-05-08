#!/usr/bin/env ruby

require 'digest'

# Get the filename
filename = ARGV[0]

# Hash the file
hash = Digest::SHA256.hexdigest File.read filename

# Take only the first 20 bytes
hash = hash[0..39]

# Prepend 0x00 to the hash
hash = "00" + hash

# Calculate the checksum
checksum = Digest::SHA256.hexdigest [hash].pack("H*")
checksum = Digest::SHA256.hexdigest [checksum].pack("H*")

# Pull out the first 4 bytes
checksum = checksum[0..7]

def encode_base58(hex)
   int_val = hex.to_i(16)
   alpha = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
   base58_val, base = '', alpha.size
   while int_val > 0
      int_val, remainder = int_val.divmod(base)
      base58_val = alpha[remainder] + base58_val
   end
   leading_zero_bytes  = (hex.match(/^([0]+)/) ? $1 : '').size / 2
   ("1"*leading_zero_bytes) + base58_val
end

# Generate the address
address = encode_base58(hash + checksum)

puts address