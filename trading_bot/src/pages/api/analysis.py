import sys


def generate_fake_data(first, second, third):
    # Use the input value to generate some fake data
    message = f"You Initiated a trade for {first}/{second} coin pair with a value of {third} {first}"
    return message

if __name__ == "__main__":
    # If no arguments are provided, prompt the user for input
    if len(sys.argv) == 1:
        first = input("Enter first value: ")
        second = input("Enter second value: ")
        third = input("Enter third value: ")
    else:
        first = sys.argv[1]
        second = sys.argv[2]
        third = sys.argv[3]
    #   first = 'ETH'
    #   second = 'USDT'
    #   third = '1'

    # Call the generate_fake_data function with the input values
result = generate_fake_data(first, second, third)

    # Print the result
print(result)